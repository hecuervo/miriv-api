import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusPolicyNumberDto } from './create-status-policy-number.dto';

export class UpdateStatusPolicyNumberDto extends PartialType(CreateStatusPolicyNumberDto) {}
