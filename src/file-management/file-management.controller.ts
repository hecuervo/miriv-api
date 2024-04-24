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
import { FileManagementService } from './file-management.service';
import { CreateFileManagementDto } from './dto/create-file-management.dto';
import { UpdateFileManagementDto } from './dto/update-file-management.dto';

@Controller('file-management')
export class FileManagementController {
  constructor(private readonly fileManagementService: FileManagementService) {}

  @Post()
  create(@Body() createFileManagementDto: CreateFileManagementDto) {
    return this.fileManagementService.create(createFileManagementDto);
  }

  @Get('/:section/:whatId')
  findAll(
    @Param('section') section: string,
    @Param('whatId') whatId: string,
    @Req() req: Request,
  ) {
    if (
      req['user'].role === 'ARRENDADOR' ||
      req['user'].role === 'ARRENDATARIO'
    ) {
      return this.fileManagementService.findAll(
        +whatId,
        section,
        req['user'].id,
      );
    } else {
      return this.fileManagementService.findAll(+whatId, section, null);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileManagementService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFileManagementDto: UpdateFileManagementDto,
  ) {
    return this.fileManagementService.update(+id, updateFileManagementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileManagementService.remove(+id);
  }
}
