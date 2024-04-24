import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { StorageModule } from 'src/storage/storage.module';
import { PropertiesModule } from 'src/properties/properties.module';
import { ProfileModule } from 'src/profile/profile.module';
import { PropertyPhotosModule } from 'src/property-photos/property-photos.module';
import { FileManagementModule } from 'src/file-management/file-management.module';

@Module({
  imports: [
    StorageModule,
    ProfileModule,
    PropertiesModule,
    PropertyPhotosModule,
    FileManagementModule,
  ],
  controllers: [MediaController],
})
export class MediaModule {}
