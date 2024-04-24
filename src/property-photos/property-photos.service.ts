import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyPhotoDto } from './dto/create-property-photo.dto';
import { PropertyPhoto } from './entities/property-photo.entity';
import { DataSource, Repository } from 'typeorm';
import { PropertiesService } from 'src/properties/properties.service';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageService } from 'src/storage/storage.service';
import { UpdatePropertyPhotoDto } from './dto/update-property-photo.dto';

@Injectable()
export class PropertyPhotosService {
  constructor(
    @InjectRepository(PropertyPhoto)
    private readonly repository: Repository<PropertyPhoto>,
    private propertyServices: PropertiesService,
    private dataSource: DataSource,
    private storageService: StorageService,
  ) {}

  async create(
    createPropertyPhotoDto: CreatePropertyPhotoDto,
  ): Promise<PropertyPhoto> {
    const property = await this.propertyServices.findOne(
      createPropertyPhotoDto.propertyId,
    );
    return await this.repository.save({
      ...createPropertyPhotoDto,
      property,
    });
  }

  async findAll(propertyId: number): Promise<PropertyPhoto[]> {
    return await this.dataSource
      .createQueryBuilder(PropertyPhoto, 'propertyPhoto')
      .where('propertyPhoto.propertyId = :propertyId', { propertyId })
      .getMany();
  }

  async remove(id: number) {
    const item = await this.repository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    await this.storageService.delete(
      `property-gallery/property-${item.property}/${item.mediaId}`,
    );
    return await this.repository.remove(item);
  }

  async removeByOwner(id: number, ownerId: number) {
    const item = await this.repository.findOne({
      where: { id, ownerId },
      relations: ['property'],
    });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    await this.storageService.delete(
      `property-gallery/property-${item.property.id}/${item.mediaId}`,
    );
    return await this.repository.remove(item);
  }

  async setFavorite(
    id: number,
    updatePropertyPhotoDto: UpdatePropertyPhotoDto,
  ) {
    const item = await this.repository.findOne({
      where: { id, ownerId: updatePropertyPhotoDto.ownerId },
      relations: ['property'],
    });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    await this.repository.update(
      { property: item.property },
      { isFavorite: false },
    );
    item.isFavorite = updatePropertyPhotoDto.isFavorite;
    return await this.repository.save(item);
  }
}
