import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSepomexDto } from './dto/create-sepomex.dto';
import { UpdateSepomexDto } from './dto/update-sepomex.dto';
import { Sepomex } from './entities/sepomex.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SepomexService {
  constructor(
    @InjectRepository(Sepomex)
    private readonly repository: Repository<Sepomex>,
  ) {}

  async create(createSepomexDto: CreateSepomexDto): Promise<Sepomex> {
    return await this.repository.save(createSepomexDto);
  }

  async findAll(cp: string): Promise<Sepomex[]> {
    return await this.repository.find({ where: { d_codigo: cp } });
  }

  async findOne(id: number): Promise<Sepomex> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: number, updateSepomexDto: UpdateSepomexDto) {
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    Object.assign(item, updateSepomexDto);
    return await this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return await this.repository.delete(id);
  }
}
