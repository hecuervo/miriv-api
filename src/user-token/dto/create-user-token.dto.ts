import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsDate,
} from 'class-validator';
export class CreateUserTokenDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsInt()
  @IsDate()
  expirationDate: Date;
}
