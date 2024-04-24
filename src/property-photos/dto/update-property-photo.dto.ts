import { PartialType } from '@nestjs/swagger';
import { CreatePropertyPhotoDto } from './create-property-photo.dto';

export class UpdatePropertyPhotoDto extends PartialType(CreatePropertyPhotoDto) {}
