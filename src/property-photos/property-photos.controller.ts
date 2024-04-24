import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Patch,
} from '@nestjs/common';
import { PropertyPhotosService } from './property-photos.service';
import { CreatePropertyPhotoDto } from './dto/create-property-photo.dto';
import { UpdatePropertyPhotoDto } from './dto/update-property-photo.dto';

@Controller('property-photos')
export class PropertyPhotosController {
  constructor(private readonly propertyPhotosService: PropertyPhotosService) {}

  @Post()
  create(
    @Body() createPropertyPhotoDto: CreatePropertyPhotoDto,
    @Req() request: Request,
  ) {
    if (request['user'].role === 'ARRENDADOR') {
      createPropertyPhotoDto.ownerId = request['user'].sub;
    }
    return this.propertyPhotosService.create(createPropertyPhotoDto);
  }

  @Get(':propertyId')
  findAll(@Param('propertyId') propertyId: string) {
    return this.propertyPhotosService.findAll(+propertyId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyPhotoDto: UpdatePropertyPhotoDto,
    @Req() request: Request,
  ) {
    if (request['user'].role === 'ARRENDADOR') {
      updatePropertyPhotoDto.ownerId = request['user'].sub;
    }
    return this.propertyPhotosService.setFavorite(+id, updatePropertyPhotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    console.log(request['user'].role);
    if (request['user'].role === 'ARRENDADOR') {
      return this.propertyPhotosService.removeByOwner(+id, request['user'].sub);
    } else {
      return this.propertyPhotosService.remove(+id);
    }
  }
}
