import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentsCatalogDto } from './dto/create-documents-catalog.dto';
import { UpdateDocumentsCatalogDto } from './dto/update-documents-catalog.dto';
import { DocumentsCatalog } from './entities/documents-catalog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DocumentsCatalogService {


  constructor(
    @InjectRepository(DocumentsCatalog)
    private readonly repository: Repository<DocumentsCatalog>,
    private usersService: UsersService
  ) { }

  async create(createDocumentsCatalogDto: CreateDocumentsCatalogDto): Promise<DocumentsCatalog> {
    const user = await this.usersService.findOne(createDocumentsCatalogDto.createdById);
    return await this.repository.save({ ...createDocumentsCatalogDto, createdBy: user, modifiedById: user });
  }

  async findAll(): Promise<DocumentsCatalog[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<DocumentsCatalog> {
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

  async update(id: number, updateDocumentsCatalogDto: UpdateDocumentsCatalogDto): Promise<DocumentsCatalog> {
    const modifiedBy = await this.usersService.findOne(updateDocumentsCatalogDto.modifiedById);
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Item with ID ${id} not found');
    }
    Object.assign(user, updateDocumentsCatalogDto);
    user.modifiedBy = modifiedBy;
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
