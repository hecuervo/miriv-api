import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {

  constructor(
    @InjectRepository(Profile)
    private readonly repository: Repository<Profile>
  ) { }

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    return await this.repository.save(createProfileDto);
  }

  async findAll(): Promise<Profile[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<Profile> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Item with ID ${id} not found');
    }
    Object.assign(user, updateProfileDto);
    return await this.repository.save(user);
  }

  async remove(id: number) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return await this.repository.remove(user);
  }
}
