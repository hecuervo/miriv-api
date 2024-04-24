import {
  IsBoolean,
  IsOptional,
  IsString,
  IsInt,
  IsEnum,
} from 'class-validator';

export class CreateFileManagementDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  fileType: string;

  @IsInt()
  @IsOptional()
  maxSize: number;

  @IsInt()
  @IsOptional()
  size: number;

  @IsEnum(['AGENTE', 'ARRENDADOR', 'PROPIEDAD', 'FIADOR', 'ARRENDATARIO'])
  @IsOptional()
  section: string;

  @IsBoolean()
  isRequired: boolean;

  @IsBoolean()
  isVerified: boolean;

  @IsString()
  @IsOptional()
  folder: string;

  @IsString()
  @IsOptional()
  mediaId: string;

  @IsInt()
  @IsOptional()
  customerId: number;

  @IsInt()
  @IsOptional()
  propertyId: number;

  @IsInt()
  @IsOptional()
  createdById: number;

  @IsInt()
  @IsOptional()
  modifiedById: number;
}
