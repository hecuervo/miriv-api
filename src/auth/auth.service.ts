import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from "src/users/dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { CreateProfileDto } from "src/profile/dto/create-profile.dto";
import { ProfileService } from "src/profile/profile.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private profileService: ProfileService, private jwtService: JwtService) { }
  async signIn(mobile, password) {
    const user = await this.usersService.findOneByMobile(mobile);
    if (!user) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }
    user.lastLogin = new Date();
    this.usersService.update(user.id, user);
    const payload = { sub: user.id, email: user.email, mobile: user.mobile, role: user.role };
    return {
      ...user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async signUp(createProfileDto: CreateProfileDto) {
    const existingUser = await this.usersService.findOneByMobile(createProfileDto.mobile);
    if (existingUser) {
      throw new BadRequestException("El teléfono ya está registrado");
    }
    const hashedPassword = await bcrypt.hash(Math.random().toString(20).substr(2, 6), 10);

    const newProfile = await this.profileService.create(createProfileDto);
    const newUser: CreateUserDto = {
      mobile: createProfileDto.mobile,
      name: createProfileDto.name + ' ' + createProfileDto.lastname + ' ' + createProfileDto.secondLastname,
      role: createProfileDto.role,
      email: createProfileDto.email,
      password: hashedPassword,
      isActive: true,
      profileId: newProfile.id,
      createdBy: createProfileDto.createdBy,
      modifiedBy: createProfileDto.modifiedBy,
    }
    return await this.usersService.create(newUser, newProfile);
  }


}