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

  /**
   * Crea una nueva reserva de material.
   * @param dto DTO con los datos de la reserva de material.
   * @returns La reserva de material creada.
   */
  @Post()
  create(@Body() dto: CreateReservaMaterialDto) {
    return this.reservaMaterialService.create(dto);
  }

  /**
   * Obtiene todas las reservas de material registradas.
   * @returns Arreglo de todas las reservas de material.
   */
  @Get()
  findAll() {
    return this.reservaMaterialService.findAll();
  }

  /**
   * Busca y obtiene una reserva de material específica por su ID.
   * @param id ID de la reserva de material.
   * @returns La reserva de material correspondiente.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservaMaterialService.findOne(+id);
  }

  /**
   * Actualiza los datos de una reserva de material por su ID.
   * @param id ID de la reserva de material.
   * @param dto DTO con la información que se desea modificar.
   * @returns La reserva de material actualizada.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReservaMaterialDto) {
    return this.reservaMaterialService.update(+id, dto);
  }

  /**
   * Elimina del registro una reserva de material mediante su ID.
   * @param id ID de la reserva de material a eliminar.
   * @returns Resultado de la operación de eliminación.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservaMaterialService.remove(+id);
  }

  /**
   * Obtiene todas las reservas de material correspondientes a un usuario a partir de su correo electrónico.
   * @param email Correo electrónico del usuario.
   * @returns Lista de reservas de material del usuario.
   */
  @Get('byEmail/:email')
  findByEmail(@Param('email') email: string) {
    return this.reservaMaterialService.findByEmail(email);
  }

  /**
   * Actualiza el estado de una reserva de material, calculando tiempos límites y devoluciones.
   * @param id ID de la reserva de material.
   * @param estado Nuevo estado de la reserva de material.
   * @returns Resultado del update en base de datos.
   */
  @Patch('estado/:id')
  updateEstado(
    @Param('id') id: number,
    @Body('estado') estado: EstadoReservaMaterial,
  ) {
    return this.reservaMaterialService.updateEstado(id, estado);
  }

  /**
   * Registra la calificación y el comentario al finalizar la reserva del material.
   * @param id ID de la reserva de material.
   * @param calificacion Calificación numérica.
   * @param comentario Comentario opcional.
   * @returns Resultado del update en base de datos.
   */
  @Patch('calificar/:id')
  updateCalificacion(
    @Param('id') id: number,
    @Body('calificacion') calificacion: number,
    @Body('comentario') comentario: string,
  ) {
    return this.reservaMaterialService.updateCalificacion(id, calificacion, comentario);
  }

  /**
   * Actualiza las observaciones relativas a la entrega del material prestado.
   * @param id ID de la reserva de material.
   * @param observacionesEntrega Texto de las observaciones de la entrega.
   * @returns Resultado de la actualización en base de datos.
   */
  @Patch('observaciones/:id')
  updateObservacionesEntrega(
    @Param('id') id: number,
    @Body('observacionesEntrega') observacionesEntrega: string,
  ) {
    return this.reservaMaterialService.updateObservacionesEntrega(id, observacionesEntrega);
  } 
}
