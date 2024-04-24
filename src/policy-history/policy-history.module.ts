import { Module } from '@nestjs/common';
import { PolicyHistoryService } from './policy-history.service';
import { PolicyHistoryController } from './policy-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyHistory } from './entities/policy-history.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyHistory]), UsersModule],
  exports: [PolicyHistoryService],
  controllers: [PolicyHistoryController],
  providers: [PolicyHistoryService],
})
export class PolicyHistoryModule {}
