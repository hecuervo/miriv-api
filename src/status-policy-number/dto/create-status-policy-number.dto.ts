import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';
export class CreateStatusPolicyNumberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsOptional()
  orden: number;

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
