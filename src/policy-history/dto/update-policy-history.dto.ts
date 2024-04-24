import { PartialType } from '@nestjs/mapped-types';
import { CreatePolicyHistoryDto } from './create-policy-history.dto';

export class UpdatePolicyHistoryDto extends PartialType(CreatePolicyHistoryDto) {}
