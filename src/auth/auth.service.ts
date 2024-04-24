import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { ProfileService } from 'src/profile/profile.service';
import { ConfigService } from '@nestjs/config';
import { UserTokenService } from 'src/user-token/user-token.service';
import { UserToken } from 'src/user-token/entities/user-token.entity';
import { EmailService } from 'src/email/email.service';
import { DocumentsEvent } from 'src/file-management/events/documents.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private profileService: ProfileService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private tokenService: UserTokenService,
    private eventEmitter: EventEmitter2,
  ) {}
  async signIn(username, password) {
    const user = await this.usersService.findOneByEmailMobile(username);
    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }
    user.lastLogin = new Date();
    this.usersService.update(user.id, user);
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
  async signUp(createProfileDto: CreateProfileDto) {
    const hashedPassword = await bcrypt.hash(
      Math.random().toString(20).substr(2, 6),
      10,
    );

    const newProfile = await this.profileService.create(createProfileDto);
    const newUser: CreateUserDto = {
      mobile: createProfileDto.mobile,
      name:
        createProfileDto.name +
        ' ' +
        createProfileDto.lastname +
        ' ' +
        createProfileDto.secondLastname,
      role: createProfileDto.role,
      email: createProfileDto.email,
      password: hashedPassword,
      isActive: true,
      isEmailVerified: false,
      isVerified: false,
      profileId: newProfile.id,
      mainUserId: createProfileDto.mainUserId,
      createdById: createProfileDto.createdBy,
      modifiedById: createProfileDto.modifiedBy,
    };
    const user = await this.usersService.create(newUser, newProfile);

    // Send email with reset link
    const newUserToken = new UserToken();
    newUserToken.user = user;
    const userToken = await this.tokenService.save(newUserToken);
    const siteUrl = this.configService.get('SITE_URL');
    const resetLink = `${siteUrl}/authentication/reset-password/${user.id}/${userToken}`;
    if (user.role === 'AGENTE') {
      this.emailService.sendEmailWelcomeAgent(user.email, user.name, resetLink);
    } else if (
      user.role === 'ARRENDADOR' ||
      user.role === 'ARRENDATARIO' ||
      user.role === 'FIADOR'
    ) {
      if (user.role !== 'FIADOR') {
        this.emailService.sendEmailCustomer(user.email, user.name, resetLink);
      }
      const orderCreatedEvent = new DocumentsEvent();
      orderCreatedEvent.type = user.role;
      orderCreatedEvent.customerId = user.id;
      orderCreatedEvent.userId = user.id;
      this.eventEmitter.emit('create.document', orderCreatedEvent);
    }

    return {
      id: user.id,
      role: user.role,
      name: user.name,
      isActive: user.isActive,
      profile: user.profile,
    };
  }
}
