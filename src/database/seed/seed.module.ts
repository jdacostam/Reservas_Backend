import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { Espacio } from '../Entidades/espacio.entity';
import { Material } from '../Entidades/material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Espacio, Material])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
