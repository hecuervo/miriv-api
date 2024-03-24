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
  MinLength
} from 'class-validator';
import { IsUnique } from 'src/auth/is-unique-constraint';

export class CreateUserDto {


  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => value.toLowerCase().trim())
  @IsUnique({ tableName: 'user', column: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsUnique({ tableName: 'user', column: 'mobile' })
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

  @IsInt()
  @IsNotEmpty()
  profileId: number;

  @IsInt()
  @IsOptional()
  createdBy: number;

  @IsInt()
  @IsOptional()
  modifiedBy: number;
}