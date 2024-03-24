import { Module } from '@nestjs/common';
import { DocumentsCatalogService } from './documents-catalog.service';
import { DocumentsCatalogController } from './documents-catalog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsCatalog } from './entities/documents-catalog.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentsCatalog]),
    UsersModule
  ],
  exports: [DocumentsCatalogService],
  controllers: [DocumentsCatalogController],
  providers: [DocumentsCatalogService],
})
export class DocumentsCatalogModule { }
