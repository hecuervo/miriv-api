import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentsCatalogDto } from './create-documents-catalog.dto';

export class UpdateDocumentsCatalogDto extends PartialType(CreateDocumentsCatalogDto) {}
