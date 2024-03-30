import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { PropertyCategoriesService } from './property-categories.service';
import { CreatePropertyCategoryDto } from './dto/create-property-category.dto';
import { UpdatePropertyCategoryDto } from './dto/update-property-category.dto';

@Controller('property-categories')
export class PropertyCategoriesController {
  constructor(
    private readonly propertyCategoriesService: PropertyCategoriesService,
  ) {}

  @Post()
  create(
    @Body() createPropertyCategoryDto: CreatePropertyCategoryDto,
    @Req() request: Request,
  ) {
    createPropertyCategoryDto.createdById = request['user'].sub;
    const data: CreatePropertyCategoryDto = {
      ...createPropertyCategoryDto,
      createdById: request['user'].sub,
    };
    return this.propertyCategoriesService.create(data);
  }

  @Get()
  findAll() {
    return this.propertyCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyCategoryDto: UpdatePropertyCategoryDto,
    @Req() request: Request,
  ) {
    updatePropertyCategoryDto.createdById = request['user'].sub;
    const data: UpdatePropertyCategoryDto = {
      ...updatePropertyCategoryDto,
      createdById: request['user'].sub,
    };
    return this.propertyCategoriesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyCategoriesService.remove(+id);
  }
}
