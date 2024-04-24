import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => value.toLowerCase().trim())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Invalid phone number',
  })
  mobile: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(['ADMIN', 'AGENTE', 'MIRIV', 'ARRENDADOR', 'FIADOR', 'ARRENDATARIO'])
  role: string = 'AGENTE';

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsBoolean()
  @IsOptional()
  isEmailVerified: boolean;

  @IsBoolean()
  @IsOptional()
  isVerified: boolean;

  @IsInt()
  @IsNotEmpty()
  profileId: number;

  @IsInt()
  @IsOptional()
  mainUserId: number;

  @IsInt()
  @IsOptional()
  createdById: number;

  @IsInt()
  @IsOptional()
  modifiedById: number;
}
