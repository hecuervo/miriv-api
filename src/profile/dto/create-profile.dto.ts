import { Transform } from 'class-transformer';
import {
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
  @MinLength(18)
  @IsNotEmpty()
  curp: string;

  @IsString()
  @IsOptional()
  rfc: string;

  @IsString()
  @IsOptional()
  businessName: string;

  @IsEnum(['PERSONA FÍSICA', 'PERSONA MORAL'])
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
  @IsUnique({ tableName: 'profile', column: 'mobile' })
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Mobile number invalid',
  })
  mobile: string;

  @IsEnum(['ADMIN', 'AGENTE', 'MIRIV', 'ARRENDADOR', 'FIADOR', 'ARRENDATARIO'])
  role: string = 'AGENTE';

  @IsInt()
  @IsOptional()
  createdBy: number;

  @IsInt()
  @IsOptional()
  modifiedBy: number;
}
