import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsDate,
} from 'class-validator';
import { PolicyHistory } from 'src/policy-history/entities/policy-history.entity';
import { OneToMany } from 'typeorm';
export class CreatePolicyDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsInt()
  @IsNotEmpty()
  propertyId: number;

  @IsInt()
  @IsOptional()
  tenantId: number;

  @IsInt()
  @IsOptional()
  guarantorId: number;

  @IsDate()
  @IsOptional()
  startDate: string;

  @IsDate()
  @IsOptional()
  endDate: string;

  @IsInt()
  @IsOptional()
  validityTime: number;

  @IsInt()
  @IsOptional()
  statusId: number;

  @IsInt()
  @IsOptional()
  price: number;

  @IsInt()
  @IsOptional()
  createdById: number;

  @IsInt()
  @IsOptional()
  modifiedById: number;

  @OneToMany(() => PolicyHistory, (policyHistory) => policyHistory.policy)
  history: PolicyHistory[];
}
