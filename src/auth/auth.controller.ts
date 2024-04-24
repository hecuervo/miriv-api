import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Public } from './public-strategy';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { UserTokenService } from 'src/user-token/user-token.service';
import { StorageService } from 'src/storage/storage.service';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userTokenService: UserTokenService,
    private storageService: StorageService,
  ) {}
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('register')
  async signUp(
    @Body() createProfileDto: CreateProfileDto,
    @Req() request: Request,
  ) {
    createProfileDto.createdBy = request['user']?.sub;
    return await this.authService.signUp(createProfileDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password-request')
  resetPasswordRequest(@Body() resetPassword: Record<string, any>) {
    return this.userTokenService.requestPasswordReset(resetPassword.email);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  resetPassword(@Body() resetPassword: Record<string, any>) {
    return this.userTokenService.resetPassword(
      resetPassword.userId,
      resetPassword.token,
      resetPassword.password,
    );
  }

  @Post('change-password')
  changePassword(
    @Body() changePassword: Record<string, any>,
    @Req() request: Request,
  ) {
    return this.userTokenService.changePassword(
      request['user'].sub,
      changePassword.oldPassword,
      changePassword.password,
    );
  }
}
