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
    const mainUser = await this.usersRepository.findOneBy({
      id: createUserDto.mainUserId,
    });
    return await this.usersRepository.save({
      ...createUserDto,
      profile: profile,
      createdBy: user,
      modifiedBy: user,
      mainUser: mainUser,
    });
  }

  async findOneByMobile(mobile: string): Promise<User> {
    return await this.usersRepository.findOneBy({ mobile, isActive: true });
  }

  async findOneById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id, isActive: true });
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

  async findAll(
    role: string,
    createdById?: number,
    tenantId?: number,
  ): Promise<User[]> {
    return await this.usersRepository.find({
      where: {
        role,
        ...(createdById && { createdBy: { id: createdById } }),
        ...(tenantId && { mainUser: { id: tenantId } }),
      },
      select: {
        id: true,
        name: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        isVerified: true,
        mainUser: {
          id: true,
          name: true,
        },
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
        mainUser: true,
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
        isVerified: true,
        isEmailVerified: true,
        mainUser: {
          id: true,
          name: true,
        },

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
        mainUser: true,
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
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile', 'files', 'properties'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (user.properties.length > 0) {
      throw new NotFoundException(
        'No se puede eliminar el usuario, tiene propiedades asignadas.',
      );
    }
    if (user.files.length > 0) {
      throw new NotFoundException(
        'No se puede eliminar el usuario, tiene archivos asignados.',
      );
    }

    return await this.usersRepository.softRemove(user);
  }

  async verify(userId: number, modifiedById: number, createdBy?: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
        ...(createdBy && { createdBy: { id: createdBy } }),
      },
      relations: ['profile', 'files'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    let isAllFilesUploaded = true;
    let isAllFilesVerified = true;
    user.files.map((file) => {
      if (!file.mediaId) {
        isAllFilesUploaded = false;
      }
      if (!file.isVerified && file.isRequired) {
        isAllFilesVerified = false;
      }
    });
    if (!isAllFilesUploaded) {
      throw new NotFoundException(
        'Por favor adjunta todos los documentos obligatorios.',
      );
    }
    if (!isAllFilesVerified) {
      throw new NotFoundException(
        'Es necesario verificar cada documento adjunto.',
      );
    }
    if (
      !user.profile.name ||
      !user.profile.lastname ||
      !user.profile.secondLastname ||
      !user.profile.curp ||
      !user.profile.email ||
      !user.profile.mobile ||
      !user.profile.rfc ||
      !user.profile.address ||
      !user.profile.personType
    ) {
      throw new NotFoundException(
        'Por favor completa la información personal para verificar la cuenta.',
      );
    }
    const modifiedBy = await this.usersRepository.findOneBy({
      id: modifiedById,
    });
    user.isVerified = true;
    user.modifiedBy = modifiedBy;
    await this.usersRepository.save(user);
    return await this.findOne(userId);
  }
}
