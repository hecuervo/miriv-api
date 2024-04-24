import { Module } from '@nestjs/common';
import { SepomexService } from './sepomex.service';
import { SepomexController } from './sepomex.controller';
import { Sepomex } from './entities/sepomex.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sepomex])],
  exports: [SepomexService],
  controllers: [SepomexController],
  providers: [SepomexService],
})
export class SepomexModule {}
