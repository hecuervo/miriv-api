import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from './entities/user-token.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectRepository(UserToken)
    private readonly repository: Repository<UserToken>,
    private usersService: UsersService
  ) { }

  async requestPasswordReset(email: string) {
    const existingUser = await this.usersService.findOneByEmail(email);
    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const token = await this.repository.findOneBy({ user: { id: existingUser.id } });

    if (token)
      await this.repository.remove(token);

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);

    await this.repository.save({ user: existingUser, token: hash, expirationDate: new Date(Date.now() + 3600000) });
    return {
      id: existingUser.id,
      token: resetToken
    }
  }

  async resetPassword(userId: number, token: string, password: string) {
    const tokenEntity = await this.repository.findOne({ where: { user: { id: userId } } });
    if (!tokenEntity) {
      throw new NotFoundException('Token de restablecimiento de contraseña no válido o caducado');
    }

    const isMatch: boolean = bcrypt.compareSync(token, tokenEntity.token);
    if (!isMatch) {
      throw new NotFoundException('Token de restablecimiento de contraseña no válido o caducado');
    }

    const user = await this.usersService.findOne(userId);
    const newPassword = await bcrypt.hash(password, 10);
    user.password = newPassword;
    await this.repository.remove(tokenEntity);
    return await this.usersService.update(user.id, user);

  }

}
