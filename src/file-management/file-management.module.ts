import { Module } from '@nestjs/common';
import { FileManagementService } from './file-management.service';
import { FileManagementController } from './file-management.controller';
import { FileManagement } from './entities/file-management.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { PropertiesModule } from 'src/properties/properties.module';
import { DocumentsCatalogModule } from 'src/documents-catalog/documents-catalog.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileManagement]),
    UsersModule,
    PropertiesModule,
    DocumentsCatalogModule,
    StorageModule,
  ],
  exports: [FileManagementService],
  controllers: [FileManagementController],
  providers: [FileManagementService],
})
export class FileManagementModule {}
