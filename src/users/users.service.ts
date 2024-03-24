import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from 'src/profile/entities/profile.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) { }


  async create(createUserDto: CreateUserDto, profile: Profile) {

    return await this.usersRepository.save({ ...createUserDto, profile });
  }

  async findOneByMobile(mobile: string): Promise<User> {
    return await this.usersRepository.findOneBy({ mobile, isActive: true });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email, isActive: true });
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({ relations: ['profile'] });
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne({ relations: ['profile'], where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return await this.usersRepository.remove(user);
  }
}
