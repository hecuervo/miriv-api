import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Res,
  Req,
  ServiceUnavailableException,
  UploadedFile,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileManagementService } from 'src/file-management/file-management.service';
import { ProfileService } from 'src/profile/profile.service';
import { PropertyPhotosService } from 'src/property-photos/property-photos.service';
import { StorageFile } from 'src/storage/storage-file';
import { StorageService } from 'src/storage/storage.service';

@Controller('media')
export class MediaController {
  constructor(
    private storageService: StorageService,
    private profileService: ProfileService,
    private propertyPhotosService: PropertyPhotosService,
    private fileManagementService: FileManagementService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
          return cb(new Error('Formato inválido '), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
    @Body('id') id: string,
    @Body('type') type: string,
    @Body('oldMediaId') oldMediaId: string,
    @Body('ownerId') ownerId: string,
    @Req() request: Request,
  ) {
    if (!file) {
      throw new NotFoundException('file not found');
    }
    if (oldMediaId) {
      await this.storageService.delete(folder + '/' + oldMediaId);
    }

    const filename =
      this.genUniqueId() + '.' + file.originalname.split('.').pop();
    await this.storageService.save(
      folder + '/' + filename,
      file.mimetype,
      file.buffer,
      [{ name: filename }],
      //[{ mediaId: id.toString(), name: filename }],
    );
    if (type === 'profile') {
      await this.profileService.updateProfilePicture(
        +id,
        filename,
        request['user'].sub,
      );
    }
    if (type === 'property-gallery') {
      await this.propertyPhotosService.create({
        isFavorite: false,
        propertyId: +id,
        mediaId: filename,
        ownerId: ownerId ?? request['user'].sub,
      });
    }

    if (
      type === 'PROPIEDAD' ||
      type === 'ARRENDADOR' ||
      type === 'ARRENDATARIO' ||
      type === 'FIADOR'
    ) {
      await this.fileManagementService.update(+id, {
        mediaId: filename,
        size: file.size,
        folder: folder,
      });
    }
  }

  @Get('download/:path')
  async downloadMedia(@Param('path') paths: string, @Res() res: Response) {
    let storageFile: StorageFile;
    try {
      console.log(paths);
      storageFile = await this.storageService.getWithMetaData(paths);
    } catch (e) {
      console.log(e);
      if (e.message.toString().includes('No such object')) {
        throw new NotFoundException('image not found');
      } else {
        throw new ServiceUnavailableException('internal error');
      }
    }
    res.setHeader('Content-Type', storageFile.contentType);
    res.setHeader('Cache-Control', 'max-age=60d');
    res.end(storageFile.buffer);
  }

  private genUniqueId(): string {
    const dateStr = Date.now().toString(36); // convert num to base 36 and stringify

    const randomStr = Math.random().toString(36).substring(2, 8); // start at index 2 to skip decimal point

    return `${dateStr}-${randomStr}`;
  }
}
