import { Module } from '@nestjs/common';
import { UserTokenService } from './user-token.service';
import { UsersModule } from 'src/users/users.module';
import { UserToken } from './entities/user-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserToken]),
    UsersModule,
    EmailModule
  ],
  exports: [UserTokenService],
  providers: [UserTokenService],
})
export class UserTokenModule { }
