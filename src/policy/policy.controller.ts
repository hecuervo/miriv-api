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
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
@ApiTags('policy')
@ApiBearerAuth()
@Controller('policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  create(@Body() createPolicyDto: CreatePolicyDto, @Req() req: Request) {
    createPolicyDto.createdById = req['user'].sub;
    return this.policyService.create(createPolicyDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    if (req['user'].role === 'ARRENDADOR') {
      return this.policyService.findAll(req['user'].sub);
    }
    return this.policyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    if (req['user'].role === 'ARRENDADOR') {
      return this.policyService.findOne(+id, req['user'].sub);
    } else {
      return this.policyService.findOne(+id);
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePolicyDto: UpdatePolicyDto,
    @Req() req: Request,
  ) {
    updatePolicyDto.modifiedById = req['user'].sub;
    return this.policyService.update(+id, updatePolicyDto);
  }

  @Roles(Role.Admin, Role.Miriv, Role.StateAgent)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.policyService.remove(+id);
  }

  @Roles(Role.Admin, Role.Miriv, Role.StateAgent)
  @Post('send-reminder-to-complete')
  sendReminderToCompletePolicy(@Body() data: Record<string, any>) {
    return this.policyService.sendReminderToCompletePolicy(data.id);
  }

  @Roles(Role.Admin, Role.Miriv, Role.StateAgent)
  @Post('change-status')
  changeStatus(@Body() data: Record<string, any>, @Req() req: Request) {
    return this.policyService.changeStatus(
      data.id,
      data.nextStatusId,
      req['user'].sub,
    );
  }
}
