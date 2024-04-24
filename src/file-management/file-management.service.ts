import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFileManagementDto } from './dto/create-file-management.dto';
import { UpdateFileManagementDto } from './dto/update-file-management.dto';
import { FileManagement } from './entities/file-management.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { PropertiesService } from 'src/properties/properties.service';
import { DocumentsCatalogService } from 'src/documents-catalog/documents-catalog.service';
import { OnEvent } from '@nestjs/event-emitter';
import { DocumentsEvent } from './events/documents.event';
import { StorageService } from 'src/storage/storage.service';
@Injectable()
export class FileManagementService {
  constructor(
    @InjectRepository(FileManagement)
    private readonly repository: Repository<FileManagement>,
    private usersService: UsersService,
    private propertyService: PropertiesService,
    private documentsCatalogService: DocumentsCatalogService,
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
  ) {}

  @OnEvent('create.document')
  async bulkCreate(event: DocumentsEvent) {
    console.log('create.document event');
    console.log(event);
    const documents = await this.documentsCatalogService.findAllBySection(
      event.type,
    );
    const data = [];
    documents.map((document) => {
      data.push({
        name: document.name,
        description: document.description,
        fileType: document.fileType,
        maxSize: document.maxSize,
        section: document.section,
        isRequired: document.isRequired,
        isVerified: false,
        createdBy: event.userId,
        property: event.propertyId,
        customer: event.customerId,
      });
    });

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(FileManagement)
      .values(data)
      .execute();
  }

  async create(
    createFileManagementDto: CreateFileManagementDto,
  ): Promise<FileManagement> {
    const user = await this.usersService.findOne(
      createFileManagementDto.createdById,
    );
    const property = await this.propertyService.findOne(
      createFileManagementDto.propertyId,
    );
    const customer = await this.usersService.findOne(
      createFileManagementDto.customerId,
    );
    return await this.repository.save({
      ...createFileManagementDto,
      createdBy: user,
      modifiedById: user,
      property,
      customer,
    });
  }

  async findAll(
    whatId: number,
    section: string,
    createdBy: number,
  ): Promise<FileManagement[]> {
    return await this.repository.find({
      where: [
        {
          section,
          property: {
            id: whatId,
          },
          createdBy: createdBy ? { id: createdBy } : undefined,
        },
        {
          section,
          customer: {
            id: whatId,
          },
        },
      ],
      select: {
        createdBy: {
          id: true,
          name: true,
        },
        modifiedBy: {
          id: true,
          name: true,
        },
        property: {
          id: true,
          name: true,
        },
        customer: {
          id: true,
          name: true,
        },
      },
      relations: {
        createdBy: true,
        modifiedBy: true,
      },
      order: {
        description: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<FileManagement> {
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
        property: {
          id: true,
          name: true,
        },
        customer: {
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
    updateFileManagementDto: UpdateFileManagementDto,
  ): Promise<FileManagement> {
    const modifiedBy = await this.usersService.findOne(
      updateFileManagementDto.modifiedById,
    );
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item with ID ${id} not found');
    }
    if (item.mediaId && item.isVerified) {
      throw new BadRequestException(
        'No se puede eliminar un documento verificado',
      );
    }
    if (!updateFileManagementDto.mediaId) {
      await this.storageService.delete(`${item.folder}/${item.mediaId}`);
    }
    Object.assign(item, updateFileManagementDto);
    item.modifiedBy = modifiedBy;
    return await this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    if (item.isVerified) {
      throw new BadRequestException(
        'No se puede eliminar un documento verificado',
      );
    }
    return await this.repository.softRemove(item);
  }
}
