import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyCategoryDto } from './dto/create-property-category.dto';
import { UpdatePropertyCategoryDto } from './dto/update-property-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyCategory } from './entities/property-category.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PropertyCategoriesService {
  constructor(
    @InjectRepository(PropertyCategory)
    private readonly repository: Repository<PropertyCategory>,
    private usersService: UsersService,
  ) {}

  async create(
    createPropertyCategoryDto: CreatePropertyCategoryDto,
  ): Promise<PropertyCategory> {
    const user = await this.usersService.findOne(
      createPropertyCategoryDto.createdById,
    );
    const propertyCategory = await this.repository.save({
      ...createPropertyCategoryDto,
      createdBy: user,
      modifiedById: user,
    });
    return this.findOne(propertyCategory.id);
  }

  async findAll(): Promise<PropertyCategory[]> {
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
    });
  }

  async findOne(id: number): Promise<PropertyCategory> {
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
    updatePropertyCategoryDto: UpdatePropertyCategoryDto,
  ) {
    const modifiedBy = await this.usersService.findOne(
      updatePropertyCategoryDto.modifiedById,
    );
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item with ID ${id} not found');
    }
    Object.assign(item, updatePropertyCategoryDto);
    item.modifiedBy = modifiedBy;
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
