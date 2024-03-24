import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStatusPolicyNumberDto } from './dto/create-status-policy-number.dto';
import { UpdateStatusPolicyNumberDto } from './dto/update-status-policy-number.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusPolicyNumber } from './entities/status-policy-number.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatusPolicyNumberService {

  constructor(
    @InjectRepository(StatusPolicyNumber)
    private readonly repository: Repository<StatusPolicyNumber>
  ) { }

  async create(createStatusPolicyNumberDto: CreateStatusPolicyNumberDto): Promise<StatusPolicyNumber> {
    return await this.repository.save(createStatusPolicyNumberDto);
  }

  async findAll(): Promise<StatusPolicyNumber[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<StatusPolicyNumber> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: number, updateStatusPolicyNumberDto: UpdateStatusPolicyNumberDto) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Item with ID ${id} not found');
    }
    Object.assign(user, updateStatusPolicyNumberDto);
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
