import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from './entities/user-token.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectRepository(UserToken)
    private readonly repository: Repository<UserToken>,
    private usersService: UsersService,
    private configService: ConfigService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async save(userToken: UserToken): Promise<string> {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, 10);
    userToken.token = hash;
    userToken.expirationDate = new Date(Date.now() + 8 * (60 * 60 * 1000));
    await this.repository.save(userToken);
    return resetToken;
  }

  async requestPasswordReset(email: string) {
    const existingUser = await this.usersService.findOneByEmail(email);
    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const token = await this.repository.findOneBy({
      user: { id: existingUser.id },
    });

    if (token) await this.repository.remove(token);

    const newUserToken = new UserToken();
    newUserToken.user = existingUser;

    const userToken = await this.save(newUserToken);
    // Send email with reset link
    const siteUrl = this.configService.get('SITE_URL');
    const resetLink = `${siteUrl}/authentication/reset-password/${existingUser.id}/${userToken}`;
    this.emailService.sendEmailResetPasswordRequest(
      existingUser.email,
      existingUser.name,
      resetLink,
    );
    return {
      id: existingUser.id,
      token: userToken,
    };
  }

  async resetPassword(userId: number, token: string, password: string) {
    const tokenEntity = await this.repository.findOne({
      where: { user: { id: userId } },
    });
    if (!tokenEntity) {
      throw new NotFoundException(
        'Token de restablecimiento de contraseña no válido o caducado',
      );
    }

    const isMatch: boolean = bcrypt.compareSync(token, tokenEntity.token);
    if (!isMatch) {
      throw new NotFoundException(
        'Token de restablecimiento de contraseña no válido o caducado',
      );
    }

    const user = await this.usersService.findOne(userId);
    const newPassword = await bcrypt.hash(password, 10);
    user.password = newPassword;
    user.isEmailVerified = true;
    user.lastLogin = new Date();
    await this.usersService.update(user.id, user);

    await this.repository.remove(tokenEntity);

    const payload = {
      sub: user.id,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    };

    return {
      id: user.id,
      role: user.role,
      name: user.name,
      isActive: user.isActive,
      profile: user.profile,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async changePassword(userId: number, oldPassword: string, password: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isMatch: boolean = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      throw new NotFoundException('Contraseña actual incorrecta');
    }

    const newPassword = await bcrypt.hash(password, 10);
    user.password = newPassword;
    user.lastLogin = new Date();
    await this.usersService.update(user.id, user);

    const payload = {
      sub: user.id,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    };

    return {
      id: user.id,
      role: user.role,
      name: user.name,
      isActive: user.isActive,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
