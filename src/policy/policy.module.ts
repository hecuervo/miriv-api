import { Module } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { PolicyController } from './policy.controller';
import { Policy } from './entities/policy.entity';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesModule } from 'src/properties/properties.module';
import { StatusPolicyNumberModule } from 'src/status-policy-number/status-policy-number.module';
import { FileManagementModule } from 'src/file-management/file-management.module';
import { EmailModule } from 'src/email/email.module';
import { PolicyHistoryModule } from 'src/policy-history/policy-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Policy]),
    UsersModule,
    PropertiesModule,
    StatusPolicyNumberModule,
    FileManagementModule,
    EmailModule,
    PolicyHistoryModule,
  ],
  exports: [PolicyService],
  controllers: [PolicyController],
  providers: [PolicyService],
})
export class PolicyModule {}
