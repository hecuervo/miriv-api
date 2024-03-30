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
  address: string;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsInt()
  @IsNotEmpty()
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
  isActive: boolean;

  @IsInt()
  @IsOptional()
  createdById: number;

  @IsInt()
  @IsOptional()
  modifiedById: number;
}
