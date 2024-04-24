import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { UsersModule } from 'src/users/users.module';
import { PropertyCategoriesModule } from 'src/property-categories/property-categories.module';
import { SepomexModule } from 'src/sepomex/sepomex.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Property]),
    UsersModule,
    SepomexModule,
    PropertyCategoriesModule,
  ],
  exports: [PropertiesService],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
