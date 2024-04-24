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
import { IsUnique } from 'src/auth/is-unique-constraint';
export class CreateProfileDto {
  @IsInt()
  @IsOptional()
  currentId?: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsOptional()
  secondLastname: string;

  @IsString()
  @IsUnique({ tableName: 'profile', column: 'curp' })
  @IsOptional()
  curp: string;

  @IsString()
  @IsOptional()
  rfc: string;

  @IsString()
  @IsOptional()
  businessName: string;

  @IsEnum(['PERSONA FÍSICA', 'PERSONA MORAL'])
  @IsOptional()
  personType: string;

  @IsString()
  @IsOptional()
  address: string;

  @Transform(({ value }) => value.toLowerCase().trim())
  @IsUnique({ tableName: 'profile', column: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsUnique({
    tableName: 'profile',
    column: 'mobile',
    message: 'celular ya existe',
  })
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Mobile number invalid',
  })
  mobile: string;

  @IsEnum(['ADMIN', 'AGENTE', 'MIRIV', 'ARRENDADOR', 'FIADOR', 'ARRENDATARIO'])
  role: string;

  @IsString()
  @IsOptional()
  photo: string;

  @IsEnum(['FIADOR', 'OBLIGADO SOLIDARIO'])
  @IsOptional()
  typeGuarantor: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;

  @IsBoolean()
  @IsOptional()
  isVerified: boolean = false;

  @IsInt()
  @IsOptional()
  mainUserId: number;

  @IsInt()
  @IsOptional()
  createdBy: number;

  @IsInt()
  @IsOptional()
  modifiedBy: number;
}
