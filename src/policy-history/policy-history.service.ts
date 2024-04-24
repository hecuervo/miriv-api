import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePolicyHistoryDto } from './dto/create-policy-history.dto';
import { UpdatePolicyHistoryDto } from './dto/update-policy-history.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { PolicyHistory } from './entities/policy-history.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PolicyHistoryService {
  constructor(
    @InjectRepository(PolicyHistory)
    private readonly repository: Repository<PolicyHistory>,
    private usersService: UsersService,
  ) {}

  async create(
    createPolicyHistoryDto: CreatePolicyHistoryDto,
  ): Promise<PolicyHistory> {
    const user = await this.usersService.findOne(
      createPolicyHistoryDto.createdById,
    );
    return this.repository.save({
      ...createPolicyHistoryDto,
      createdBy: user,
      modifiedBy: user,
    });
  }

  async findAll(): Promise<PolicyHistory[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<PolicyHistory> {
    return this.repository.findOneBy({ id });
  }

  async update(
    id: number,
    updatePolicyHistoryDto: UpdatePolicyHistoryDto,
  ): Promise<PolicyHistory> {
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item with ID ${id} not found');
    }
    const user = await this.usersService.findOne(
      updatePolicyHistoryDto.modifiedById,
    );
    return this.repository.save({
      ...updatePolicyHistoryDto,
      modifiedBy: user,
    });
  }

  async remove(id: number) {
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item with ID ${id} not found');
    }
    return await this.repository.softRemove(item);
  }
}
