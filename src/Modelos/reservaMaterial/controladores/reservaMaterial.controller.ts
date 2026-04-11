import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReservaMaterialService } from '../servicios/reservaMaterial.services';
import { CreateReservaMaterialDto } from '../dto/create.dto';
import { UpdateReservaMaterialDto } from '../dto/update.dto';
import { EstadoReservaMaterial } from 'src/database/Entidades/reservaMaterial.entity';

@Controller('reservas-material')
export class ReservaMaterialController {
  constructor(
    private readonly reservaMaterialService: ReservaMaterialService,
  ) {}

  @Post()
  create(@Body() dto: CreateReservaMaterialDto) {
    return this.reservaMaterialService.create(dto);
  }

  @Get()
  findAll() {
    return this.reservaMaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservaMaterialService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReservaMaterialDto) {
    return this.reservaMaterialService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservaMaterialService.remove(+id);
  }

  @Get('byEmail/:email')
  findByEmail(@Param('email') email: string) {
    return this.reservaMaterialService.findByEmail(email);
  }

  @Patch('estado/:id')
  updateEstado(
    @Param('id') id: number,
    @Body('estado') estado: EstadoReservaMaterial,
  ) {
    return this.reservaMaterialService.updateEstado(id, estado);
  }

  @Patch('calificar/:id')
  updateCalificacion(
    @Param('id') id: number,
    @Body('calificacion') calificacion: number,
    @Body('comentario') comentario: string,
  ) {
    return this.reservaMaterialService.updateCalificacion(id, calificacion, comentario);
  }
  @Patch('observaciones/:id')
  updateObservacionesEntrega(
    @Param('id') id: number,
    @Body('observacionesEntrega') observacionesEntrega: string,
  ) {
    return this.reservaMaterialService.updateObservacionesEntrega(id, observacionesEntrega);
  } 
}
