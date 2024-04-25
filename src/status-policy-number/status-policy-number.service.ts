import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStatusPolicyNumberDto } from './dto/create-status-policy-number.dto';
import { UpdateStatusPolicyNumberDto } from './dto/update-status-policy-number.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusPolicyNumber } from './entities/status-policy-number.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StatusPolicyNumberService {
  constructor(
    @InjectRepository(StatusPolicyNumber)
    private readonly repository: Repository<StatusPolicyNumber>,
    private usersService: UsersService,
  ) {}

  async create(
    createStatusPolicyNumberDto: CreateStatusPolicyNumberDto,
  ): Promise<StatusPolicyNumber> {
    const user = await this.usersService.findOne(
      createStatusPolicyNumberDto.createdById,
    );
    return await this.repository.save({
      ...createStatusPolicyNumberDto,
      createdBy: user,
      modifiedById: user,
    });
  }

  async findAll(): Promise<StatusPolicyNumber[]> {
    return await this.repository.find({
      select: {
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
      },
      order: {
        orden: 'ASC',
      },
    });
  }

  async findOneByOrden(orden: number): Promise<StatusPolicyNumber> {
    return await this.repository.findOneBy({ orden });
  }

  async findOne(id: number): Promise<StatusPolicyNumber> {
    return await this.repository.findOne({
      where: {
        id,
      },
      select: {
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
      },
    });
  }

  async update(
    id: number,
    updateStatusPolicyNumberDto: UpdateStatusPolicyNumberDto,
  ) {
    const modifiedBy = await this.usersService.findOne(
      updateStatusPolicyNumberDto.modifiedById,
    );
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item with ID ${id} not found');
    }
    Object.assign(item, updateStatusPolicyNumberDto);
    item.modifiedBy = modifiedBy;
    return await this.repository.save(item);
  }

  async remove(id: number) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return await this.repository.remove(user);
  }
}
