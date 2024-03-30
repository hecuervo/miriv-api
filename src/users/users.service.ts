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
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, profile: Profile) {
    const user = await this.usersRepository.findOneBy({
      id: createUserDto.createdById,
    });
    return await this.usersRepository.save({
      ...createUserDto,
      profile: profile,
      createdBy: user,
      modifiedBy: user,
    });
  }

  async findOneByMobile(mobile: string): Promise<User> {
    return await this.usersRepository.findOneBy({ mobile, isActive: true });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email, isActive: true });
  }

  async findOneByEmailMobile(username: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: [
        { email: username, isActive: true },
        { mobile: username, isActive: true },
      ],
      relations: ['profile'],
    });
  }

  async findAll(role: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: { role },
      select: {
        id: true,
        name: true,
        role: true,
        isActive: true,
        createdBy: {
          id: true,
          name: true,
        },
        modifiedBy: {
          id: true,
          name: true,
        },
      },
      relations: {
        createdBy: true,
        modifiedBy: true,
        profile: true,
      },
      order: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        role: true,
        isActive: true,
        createdBy: {
          id: true,
          name: true,
        },
        modifiedBy: {
          id: true,
          name: true,
        },
      },
      relations: {
        properties: true,
        createdBy: true,
        modifiedBy: true,
        profile: true,
      },
    });
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
