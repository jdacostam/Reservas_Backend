import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Espacio } from '../../database/Entidades/espacio.entity';
import { EspacioService } from './servicios/espacio.services';
import { EspacioController } from './controladores/espacio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Espacio])],
  controllers: [EspacioController],
  providers: [EspacioService],
  exports: [EspacioService],
})
export class EspacioModule {}