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
    private usersService: UsersService,
  ) {}

  async create(
    createDocumentsCatalogDto: CreateDocumentsCatalogDto,
  ): Promise<DocumentsCatalog> {
    const user = await this.usersService.findOne(
      createDocumentsCatalogDto.createdById,
    );
    createDocumentsCatalogDto.name = createDocumentsCatalogDto.description
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_');
    return await this.repository.save({
      ...createDocumentsCatalogDto,
      createdBy: user,
      modifiedById: user,
    });
  }

  async findAll(): Promise<DocumentsCatalog[]> {
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
      order: { section: 'ASC', name: 'ASC' },
    });
  }

  async findAllBySection(section: string): Promise<DocumentsCatalog[]> {
    return await this.repository.find({
      where: {
        section,
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
      order: { section: 'ASC', name: 'ASC' },
    });
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

  async update(
    id: number,
    updateDocumentsCatalogDto: UpdateDocumentsCatalogDto,
  ): Promise<DocumentsCatalog> {
    const modifiedBy = await this.usersService.findOne(
      updateDocumentsCatalogDto.modifiedById,
    );
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item with ID ${id} not found');
    }
    Object.assign(item, updateDocumentsCatalogDto);
    item.modifiedBy = modifiedBy;
    return await this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return await this.repository.remove(item);
  }
}
