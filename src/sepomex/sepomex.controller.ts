import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SepomexService } from './sepomex.service';
import { CreateSepomexDto } from './dto/create-sepomex.dto';
import { UpdateSepomexDto } from './dto/update-sepomex.dto';
import { Public } from 'src/auth/public-strategy';

@Controller('sepomex')
export class SepomexController {
  constructor(private readonly sepomexService: SepomexService) {}

  @Post()
  create(@Body() createSepomexDto: CreateSepomexDto) {
    return this.sepomexService.create(createSepomexDto);
  }

  @Public()
  @Get()
  findAll(@Query('cp') cp: string) {
    return this.sepomexService.findAll(cp);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sepomexService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSepomexDto: UpdateSepomexDto) {
    return this.sepomexService.update(+id, updateSepomexDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sepomexService.remove(+id);
  }
}
