import { PartialType } from '@nestjs/swagger';
import { CreateSepomexDto } from './create-sepomex.dto';

export class UpdateSepomexDto extends PartialType(CreateSepomexDto) {}
