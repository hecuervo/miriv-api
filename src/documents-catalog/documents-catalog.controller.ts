import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { DocumentsCatalogService } from './documents-catalog.service';
import { CreateDocumentsCatalogDto } from './dto/create-documents-catalog.dto';
import { UpdateDocumentsCatalogDto } from './dto/update-documents-catalog.dto';

@Controller('documents-catalog')
export class DocumentsCatalogController {
  constructor(private readonly documentsCatalogService: DocumentsCatalogService) { }

  @Post()
  create(@Body() createDocumentsCatalogDto: CreateDocumentsCatalogDto, @Req() request: Request) {
    createDocumentsCatalogDto.createdById = request['user'].sub;
    const document: CreateDocumentsCatalogDto = { ...createDocumentsCatalogDto, createdById: request['user'].sub };
    return this.documentsCatalogService.create(document);
  }

  @Get()
  findAll() {
    return this.documentsCatalogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsCatalogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentsCatalogDto: UpdateDocumentsCatalogDto, @Req() request: Request) {
    updateDocumentsCatalogDto.modifiedById = request['user'].sub;
    return this.documentsCatalogService.update(+id, updateDocumentsCatalogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsCatalogService.remove(+id);
  }
}
