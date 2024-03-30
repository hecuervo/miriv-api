import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PropertyCategoriesService } from 'src/property-categories/property-categories.service';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly repository: Repository<Property>,
    private usersService: UsersService,
    private propertyCategoriesService: PropertyCategoriesService,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const user = await this.usersService.findOne(createPropertyDto.createdById);
    const categoryProperty = await this.propertyCategoriesService.findOne(
      createPropertyDto.categoryId,
    );
    const owner = await this.usersService.findOne(createPropertyDto.ownerId);
    const propety = await this.repository.save({
      ...createPropertyDto,
      category: categoryProperty,
      owner,
      createdBy: user,
      modifiedById: user,
    });
    return this.findOne(propety.id);
  }

  async findAll(): Promise<Property[]> {
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
        category: {
          id: true,
          name: true,
        },
        owner: {
          id: true,
          name: true,
        },
      },
      relations: {
        createdBy: true,
        modifiedBy: true,
        category: true,
        owner: true,
      },
    });
  }

  async findOne(id: number): Promise<Property> {
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
        category: {
          id: true,
          name: true,
        },
        owner: {
          id: true,
          name: true,
        },
      },
      relations: {
        createdBy: true,
        modifiedBy: true,
        category: true,
        owner: true,
      },
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
    const owner = await this.usersService.findOne(updatePropertyDto.ownerId);
    Object.assign(item, updatePropertyDto);
    item.modifiedBy = modifiedBy;
    item.category = categoryProperty;
    item.owner = owner;
    await this.repository.save(item);
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return await this.repository.remove(user);
  }
}
