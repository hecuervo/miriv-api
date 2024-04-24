import { Module } from '@nestjs/common';
import { PropertyPhotosService } from './property-photos.service';
import { PropertyPhotosController } from './property-photos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyPhoto } from './entities/property-photo.entity';
import { PropertiesModule } from 'src/properties/properties.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropertyPhoto]),
    PropertiesModule,
    StorageModule,
  ],
  exports: [PropertyPhotosService],
  controllers: [PropertyPhotosController],
  providers: [PropertyPhotosService],
})
export class PropertyPhotosModule {}
