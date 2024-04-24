import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePolicyHistoryDto {
  @IsString()
  @IsOptional()
  note: string;

  @IsInt()
  @IsNotEmpty()
  policyId: number;

  @IsInt()
  @IsNotEmpty()
  statusId: number;

  @IsInt()
  @IsNotEmpty()
  createdById: number;

  @IsInt()
  @IsOptional()
  modifiedById: number;
}
