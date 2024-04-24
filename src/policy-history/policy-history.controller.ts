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
import { PolicyHistoryService } from './policy-history.service';
import { CreatePolicyHistoryDto } from './dto/create-policy-history.dto';
import { UpdatePolicyHistoryDto } from './dto/update-policy-history.dto';

@Controller('policy-history')
export class PolicyHistoryController {
  constructor(private readonly policyHistoryService: PolicyHistoryService) {}

  @Post()
  create(
    @Body() createPolicyHistoryDto: CreatePolicyHistoryDto,
    @Req() req: Request,
  ) {
    createPolicyHistoryDto.createdById = req['user'].sub;
    return this.policyHistoryService.create(createPolicyHistoryDto);
  }

  @Get()
  findAll() {
    return this.policyHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.policyHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePolicyHistoryDto: UpdatePolicyHistoryDto,
    @Req() req: Request,
  ) {
    updatePolicyHistoryDto.createdById = req['user'].sub;
    return this.policyHistoryService.update(+id, updatePolicyHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.policyHistoryService.remove(+id);
  }
}
