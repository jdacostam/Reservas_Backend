import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaMaterial } from '../../database/Entidades/reservaMaterial.entity';
import { Material } from '../../database/Entidades/material.entity';
import { Usuario } from '../../database/Entidades/usuario.entity';
import { ReservaMaterialService } from './servicios/reservaMaterial.services';
import { ReservaMaterialController } from './controladores/reservaMaterial.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReservaMaterial, Material, Usuario])],
  controllers: [ReservaMaterialController],
  providers: [ReservaMaterialService],
  exports: [ReservaMaterialService],
})
export class ReservaMaterialModule {}
