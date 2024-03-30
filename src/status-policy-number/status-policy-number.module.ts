import { Module } from '@nestjs/common';
import { StatusPolicyNumberService } from './status-policy-number.service';
import { StatusPolicyNumberController } from './status-policy-number.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusPolicyNumber } from './entities/status-policy-number.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([StatusPolicyNumber]), UsersModule],
  exports: [StatusPolicyNumberService],
  controllers: [StatusPolicyNumberController],
  providers: [StatusPolicyNumberService],
})
export class StatusPolicyNumberModule { }
