import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsEnum,
} from 'class-validator';

export class CreateDocumentsCatalogDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  fileType: string;

  @IsInt()
  @IsOptional()
  maxSize: number;

  @IsEnum(['AGENTE', 'ARRENDADOR', 'PROPIEDAD', 'FIADOR', 'ARRENDATARIO'])
  @IsNotEmpty()
  section: string;

  @IsBoolean()
  isRequired: boolean;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsInt()
  @IsOptional()
  createdById: number;

  @IsInt()
  @IsOptional()
  modifiedById: number;
}
