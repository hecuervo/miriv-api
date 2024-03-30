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
import { StatusPolicyNumberService } from './status-policy-number.service';
import { CreateStatusPolicyNumberDto } from './dto/create-status-policy-number.dto';
import { UpdateStatusPolicyNumberDto } from './dto/update-status-policy-number.dto';

@Controller('status-policy-number')
export class StatusPolicyNumberController {
  constructor(
    private readonly statusPolicyNumberService: StatusPolicyNumberService,
  ) {}

  @Post()
  create(
    @Body() createStatusPolicyNumberDto: CreateStatusPolicyNumberDto,
    @Req() request: Request,
  ) {
    createStatusPolicyNumberDto.createdById = request['user'].sub;
    const statusPolicy: CreateStatusPolicyNumberDto = {
      ...createStatusPolicyNumberDto,
      createdById: request['user'].sub,
    };
    return this.statusPolicyNumberService.create(statusPolicy);
  }

  @Get()
  findAll() {
    return this.statusPolicyNumberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusPolicyNumberService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStatusPolicyNumberDto: UpdateStatusPolicyNumberDto,
    @Req() request: Request,
  ) {
    updateStatusPolicyNumberDto.createdById = request['user'].sub;
    const statusPolicy: UpdateStatusPolicyNumberDto = {
      ...updateStatusPolicyNumberDto,
      createdById: request['user'].sub,
    };
    return this.statusPolicyNumberService.update(+id, statusPolicy);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusPolicyNumberService.remove(+id);
  }
}
