import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  numberInt: string;

  @IsString()
  @IsOptional()
  numberExt: string;

  @IsString()
  @IsOptional()
  coverImage: string;

  @IsInt()
  @IsOptional()
  sepomexId: number;

  @IsInt()
  @IsOptional()
  categoryId: number;

  @IsInt()
  @IsOptional()
  ownerId: number;

  @IsString()
  @IsOptional()
  latitude: string;

  @IsString()
  @IsOptional()
  longitude: string;

  @IsString()
  @IsOptional()
  linkMap: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean = false;

  @IsBoolean()
  @IsOptional()
  isGuarantee: boolean = false;

  @IsInt()
  @IsOptional()
  createdById: number;

  @IsInt()
  @IsOptional()
  modifiedById: number;
}
