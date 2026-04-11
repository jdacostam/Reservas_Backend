import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendario } from '../../database/Entidades/calendario.entity';
import { CalendarioService } from './servicios/calendario.service';
import { CalendarioController } from './controladores/calendario.controller';
import { Espacio } from '../../database/Entidades/espacio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calendario, Espacio])],
  controllers: [CalendarioController],
  providers: [CalendarioService],
  exports: [CalendarioService],
})
export class CalendarioModule {}