import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';
export class CreatePropertyPhotoDto {
  @IsString()
  @IsNotEmpty()
  mediaId: string;

  @IsBoolean()
  @IsOptional()
  isFavorite: boolean;

  @IsInt()
  @IsNotEmpty()
  propertyId: number;

  @IsInt()
  @IsNotEmpty()
  ownerId: number;
}
