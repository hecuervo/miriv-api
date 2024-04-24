import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repository: Repository<Profile>,
    private usersService: UsersService,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    return await this.repository.save(createProfileDto);
  }

  async findAll(): Promise<Profile[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<Profile> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const modifiedBy = await this.usersService.findOne(
      updateProfileDto.modifiedBy,
    );
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('Item with ID ${id} not found');
    }
    user.email = updateProfileDto.email;
    user.name =
      updateProfileDto.name +
      ' ' +
      updateProfileDto.lastname +
      ' ' +
      updateProfileDto.secondLastname;
    user.isActive = updateProfileDto.isActive;
    user.modifiedBy = modifiedBy;
    user.mobile = updateProfileDto.mobile;
    this.usersService.update(user.id, user);

    const profile = await this.repository.findOneBy({ id: user.profile.id });
    if (!profile) {
      throw new NotFoundException('Item with ID ${id} not found');
    }
    Object.assign(profile, updateProfileDto);
    await this.repository.save(profile);
    return await this.usersService.findOne(id);
  }

  async remove(id: number) {
    const profile = await this.repository.findOneBy({ id });
    if (!profile) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return await this.repository.remove(profile);
  }

  async updateProfilePicture(id: number, photo: string, modifiedBy: number) {
    const profile = await this.repository.findOneBy({ id });
    if (!profile) {
      throw new NotFoundException(`Item with Id ${id} not found`);
    }
    profile.photo = photo;
    profile.modifiedBy = modifiedBy;
    return await this.repository.save(profile);
  }
}
