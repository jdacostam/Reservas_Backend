import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from '../../database/Entidades/reserva.entity';
import { Usuario } from '../../database/Entidades/usuario.entity';
import { ReservaService } from '../reserva/servicios/reserva.services';
import { ReservaController } from './controladores/reserva.controller';
import { Calendario } from 'src/database/Entidades/calendario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Calendario, Usuario])],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}
