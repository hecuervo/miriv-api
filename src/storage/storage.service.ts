import { StorageFile } from './storage-file';
import { DownloadResponse, Storage } from '@google-cloud/storage';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private configService: ConfigService) {
    this.storage = new Storage({
      projectId: this.configService.get('PROJECT_ID'),
      credentials: {
        client_email: this.configService.get('CLIENT_EMAIL'),
        private_key:
          '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDjAoTvyv4ZrBn8\nI53Y2Jtm/bou0TfraHMw+QEcf05TtPS0UTUpqCcjiYCrQFtzlMk3E7iD2yCqaiA7\nt6ggx1LUIkQI4QMPEUh1mWiqdbdpF8+K1RTb1DvAMnh4/8wwKs70flTs/KUuGU90\noeNPMxCh/HC2N9WylXrlg7KToM8TUDPa8gege4VNZic47RRZHrbCMd/OhRFSGOox\n1VOsR//+RcN8iq/PfIBE7Q/4dwfoUNWTNsmahUcRk6dlCkWXhdSDOq8MhwLTpGyF\n97Pxxy5DEn+ZPx86v5zJtpJyxuRKcvZ4Jnv3yyilNkFdXS5SOXjurhkIROCq2b/H\nHKqNbA+JAgMBAAECggEAATBy2ywTEgtcGigNnE82MTSZvxkK0/Q4y5mNBJszdoN3\nggz9hvmsitEeQsdpiJIk+Qw6ETwapbSR9VN2/AT5+Bvd2LYPurUlI13ptcrmv77c\n2tCsSqKIAEUYwHmGllIDF4t54mvzFD9psntj93brBWOPK5qLR2OPwJgPXW/1kGz+\nnIoC8BnVZeRl8QkeF/FJv1AS9vOvMosPAsahKDqwqrqP/benbUzudyQP6447OSh0\nWhx4CF810twwuOWPWXObySdWONuLqQmdPLBMn5YyXTAoD9D5dv7YsODTw77I4d3w\nRVY0V2S3Lt5ojx+wm8838yWclzdBqAs21mCtsqwECQKBgQD0Xb7RyuxHyqS5GWbJ\nLDYGant+uUyxtzZNw8giPF6umKY6tlhdWBlUrQQXsHxHTe9F0Az4i9QjlYIqKu7c\nNEgQcpR14q2TNX8EvXiYkO+NtINdfCy1bVinVq/ElHCCW0cpxI32gb1re5iE0GWO\nZ+HzwUKmZBBDdrx3TXd0yxzSUwKBgQDt0T2KwJqMwIveY9R9FoEHYcmPC0qng1TG\nzkHvLmjl9lpmRDlsGars6At40JDKAYS5GIwh8+qnqEx09cuxtIvhUmwITdAaLlhm\nkCybNvj4AX7KpX7ROAs7PzETCK1m6pUUU02zfjaRO1Gclrkw8O7QdlJKwSaK1gNG\nS0ezgmYTMwKBgQC+f35Mahb8eHslWSoJ1g9fvQ784VNqj1skEGYqWkmtbo7X4mLM\nketdWWuBVDHuHFFVaTVTZR5Bh0HrwYBn5dHwEIKvy8BorCGS/mnO9d3p6DkoXa80\n2ENuYGOxqc5zsNivNO0+qDGUYsupbhRdiZpZveVJdWRAU4Xks11WjSiwxQKBgQC2\nmFRnR5Cih2gc/Yt166RwFY3bjbDpQzYBWvZW/cw+3NL1+GYacO7C7Tt5rLGu2FGe\niJF3tD80MU1a9CpMrDJGc7FNAunIYFMxlHsbRa8NRKCkWUMwwpYlDFTSp3P0NCL4\nsylSqpKdGe2EjFlukV7boi13BixgpwdmnoBT/MgA7wKBgQDWfSW/uPCQmi4wLu+n\nYrjPZrTO6v6Use9ClJxcJFqC3kS5ymarHodLEOJRd0ClouXLmYV+zYU57JpKBpVX\nVT0U55BQbm0BNBpFjvSGotu4o3a8Rj0TM+FyEWSQhQEOBdrE6nFc3JNkpfZwLPTA\n4bimSP/cmyTeAYusax77+DKnNQ==\n-----END PRIVATE KEY-----\n',
      },
    });

    this.bucket = this.configService.get('STORAGE_MEDIA_BUCKET');
  }

  async save(
    path: string,
    contentType: string,
    media: Buffer,
    metadata: { [key: string]: string }[],
  ) {
    const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});
    const file = this.storage.bucket(this.bucket).file(path);
    const stream = file.createWriteStream();
    return new Promise<void>((resolve, reject) => {
      stream.on('finish', async () => {
        console.log('file uploaded successfully');
        try {
          await file.setMetadata({
            metadata: object,
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      stream.on('error', (error) => {
        this.logger.error('upload stream error', error);
        reject(error);
      });

      stream.end(media);
    });
  }

  async delete(path: string) {
    /*await this.storage
      .bucket(this.bucket)
      .file(path)
      .delete({ ignoreNotFound: true });*/
  }

  async get(path: string): Promise<StorageFile> {
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;
    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>();
    return storageFile;
  }

  async getWithMetaData(path: string): Promise<StorageFile> {
    console.log('path', path);
    const [metadata] = await this.storage
      .bucket(this.bucket)
      .file(path)
      .getMetadata();
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;

    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>(
      Object.entries(metadata || {}) as readonly (readonly [string, string])[],
    );
    storageFile.contentType = storageFile.metadata.get('contentType');
    return storageFile;
  }
}
