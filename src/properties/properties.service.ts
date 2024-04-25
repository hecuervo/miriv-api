import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PropertyCategoriesService } from 'src/property-categories/property-categories.service';
import { SepomexService } from 'src/sepomex/sepomex.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DocumentsEvent } from 'src/file-management/events/documents.event';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly repository: Repository<Property>,
    private usersService: UsersService,
    private propertyCategoriesService: PropertyCategoriesService,
    private sepomexService: SepomexService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const user = await this.usersService.findOne(createPropertyDto.createdById);
    const owner = await this.usersService.findOne(createPropertyDto.ownerId);
    const sepomex = await this.sepomexService.findOne(
      createPropertyDto.sepomexId,
    );
    const category = await this.propertyCategoriesService.findOne(
      createPropertyDto.categoryId,
    );
    const property = await this.repository.save({
      ...createPropertyDto,
      category: category,
      owner,
      sepomex,
      createdBy: user,
      modifiedById: user,
    });
    const orderCreatedEvent = new DocumentsEvent();
    orderCreatedEvent.type = 'PROPIEDAD';
    orderCreatedEvent.propertyId = property.id;
    orderCreatedEvent.userId = user.id;

    this.eventEmitter.emit('create.document', orderCreatedEvent);

    return this.findOne(property.id);
  }

  async findAll(ownerId?: number, isGuarantee?: boolean): Promise<Property[]> {
    return await this.repository.find({
      where: {
        ...(ownerId && { owner: { id: ownerId } }),
        ...(!isGuarantee && { isGuarantee: isGuarantee }),
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
        category: {
          id: true,
          name: true,
        },
        owner: {
          id: true,
          name: true,
        },
        photos: {
          mediaId: true,
          isFavorite: true,
        },
        policy: {
          id: true,
          name: true,
          endDate: true,
        },
      },
      relations: {
        createdBy: true,
        modifiedBy: true,
        category: true,
        sepomex: true,
        owner: true,
        photos: true,
        policy: true,
      },
    });
  }

  async findOne(id: number, ownerId?: number): Promise<Property> {
    return await this.repository.findOne({
      where: {
        id,
        ...(ownerId && { owner: { id: ownerId } }),
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
        category: {
          id: true,
          name: true,
        },
        files: true,
        owner: {
          id: true,
          name: true,
          email: true,
          files: true,
          createdBy: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      relations: [
        'createdBy',
        'modifiedBy',
        'category',
        'owner',
        'owner.createdBy',
        'owner.files',
        'files',
        'sepomex',
      ],
    });
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto) {
    const modifiedBy = await this.usersService.findOne(
      updatePropertyDto.modifiedById,
    );
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item with ID ${id} not found');
    }
    const categoryProperty = await this.propertyCategoriesService.findOne(
      updatePropertyDto.categoryId,
    );
    Object.assign(item, updatePropertyDto);
    item.modifiedBy = modifiedBy;
    item.category = categoryProperty;
    await this.repository.save(item);
    return this.findOne(id);
  }

  async remove(id: number) {
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    if (item.isActive) {
      throw new BadRequestException(
        'No se puede eliminar una propiedad verificada',
      );
    }
    return await this.repository.softRemove(item);
  }

  async restore(id: number) {
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return await this.repository.restore(item);
  }

  async verify(propertyId: number, modifiedById: number, createdBy?: number) {
    const item = await this.repository.findOne({
      where: {
        id: propertyId,
        ...(createdBy && { createdBy: { id: createdBy } }),
      },
      relations: ['files', 'category', 'sepomex'],
    });
    if (!item) {
      throw new NotFoundException(`Item with ID ${propertyId} not found`);
    }
    let isAllFilesUploaded = true;
    let isAllFilesVerified = true;
    item.files.map((file) => {
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
      !item.name ||
      !item.category ||
      !item.sepomex ||
      !item.street ||
      !item.numberExt
    ) {
      throw new BadRequestException(
        'Por favor completa la información para verificar la propiedad.',
      );
    }

    const modifiedBy = await this.usersService.findOne(modifiedById);
    item.isActive = true;
    item.modifiedBy = modifiedBy;
    await this.repository.save(item);
    return this.findOne(propertyId);
  }
}
