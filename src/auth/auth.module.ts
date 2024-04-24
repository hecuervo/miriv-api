import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { User } from 'src/users/entities/user.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { UserTokenModule } from 'src/user-token/user-token.module';
import { StorageModule } from 'src/storage/storage.module';
import { EmailModule } from 'src/email/email.module';
import { RolesGuard } from './roles/role.guard';

@Module({
  imports: [
    UsersModule,
    ProfileModule,
    UserTokenModule,
    StorageModule,
    EmailModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
