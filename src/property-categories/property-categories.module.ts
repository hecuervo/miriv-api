import { Module } from '@nestjs/common';
import { PropertyCategoriesService } from './property-categories.service';
import { PropertyCategoriesController } from './property-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyCategory } from './entities/property-category.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyCategory]), UsersModule],
  exports: [PropertyCategoriesService],
  controllers: [PropertyCategoriesController],
  providers: [PropertyCategoriesService],
})
export class PropertyCategoriesModule {}
