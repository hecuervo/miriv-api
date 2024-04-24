import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSepomexDto {
  @IsString()
  @IsNotEmpty()
  d_codigo: string;

  @IsString()
  @IsNotEmpty()
  d_asenta: string;

  @IsString()
  @IsNotEmpty()
  d_tipo_asenta: string;

  @IsString()
  @IsNotEmpty()
  d_mnpio: string;

  @IsString()
  @IsNotEmpty()
  d_estado: string;

  @IsString()
  @IsNotEmpty()
  d_ciudad: string;

  @IsString()
  @IsNotEmpty()
  d_CP: string;

  @IsString()
  @IsNotEmpty()
  c_estado: string;

  @IsString()
  @IsNotEmpty()
  c_oficina: string;

  @IsString()
  @IsNotEmpty()
  c_CP: string;

  @IsString()
  @IsNotEmpty()
  c_tipo_asenta: string;

  @IsString()
  @IsNotEmpty()
  c_mnpio: string;

  @IsString()
  @IsNotEmpty()
  id_asenta_cpcons: string;

  @IsString()
  @IsNotEmpty()
  d_zona: string;

  @IsString()
  @IsNotEmpty()
  c_cve_ciudad: string;
}
