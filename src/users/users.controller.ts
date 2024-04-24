import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Post,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('role') role: string,
    @Query('tenantId') tenantId: string,
    @Req() req: Request,
  ) {
    if (req['user'].role === Role.StateAgent) {
      return this.usersService.findAll(role, req['user'].sub, +tenantId);
    } else {
      return this.usersService.findAll(role, null, +tenantId);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Roles(Role.Admin, Role.Miriv, Role.StateAgent)
  @Post('/verify-account')
  verify(@Body() verify: Record<string, any>, @Req() req: Request) {
    if (req['user'].role === Role.StateAgent) {
      return this.usersService.verify(
        verify.userId,
        req['user'].sub,
        req['user'].sub,
      );
    }
    return this.usersService.verify(verify.userId, req['user'].sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles(Role.Admin, Role.Miriv, Role.StateAgent)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
