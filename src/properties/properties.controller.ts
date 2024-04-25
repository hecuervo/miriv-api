import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';

@ApiTags('properties')
@ApiBearerAuth()
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  create(
    @Body() createPropertyDto: CreatePropertyDto,
    @Req() request: Request,
  ) {
    createPropertyDto.createdById = request['user'].sub;
    if (request['user'].role === 'ARRENDADOR') {
      createPropertyDto.ownerId = request['user'].sub;
    }
    return this.propertiesService.create(createPropertyDto);
  }

  @Get()
  findAll(
    @Req() request: Request,
    @Query('ownerId') ownerId: number,
    @Query('isGuarantee') isGuarantee: boolean,
  ) {
    if (request['user'].role === 'ARRENDADOR') {
      return this.propertiesService.findAll(request['user'].sub, isGuarantee);
    } else if (ownerId) {
      return this.propertiesService.findAll(ownerId, isGuarantee);
    } else {
      return this.propertiesService.findAll(null, isGuarantee);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: Request) {
    if (request['user'].role === 'ARRENDADOR') {
      return this.propertiesService.findOne(+id, request['user'].sub);
    } else {
      return this.propertiesService.findOne(+id);
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @Req() request: Request,
  ) {
    updatePropertyDto.modifiedById = request['user'].sub;
    return this.propertiesService.update(+id, updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(+id);
  }

  @Roles(Role.Admin, Role.Miriv, Role.StateAgent)
  @Post('/verify-property')
  verify(@Body() verify: Record<string, any>, @Req() req: Request) {
    if (req['user'].role === Role.StateAgent) {
      return this.propertiesService.verify(
        verify.propertyId,
        req['user'].sub,
        req['user'].sub,
      );
    }
    return this.propertiesService.verify(verify.propertyId, req['user'].sub);
  }
}
