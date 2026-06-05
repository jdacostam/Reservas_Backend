import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReservaService } from '../servicios/reserva.services';
import { CreateReservaDto } from '../dto/create.dto';
import { UpdateReservaDto } from '../dto/update.dto';

@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  /**
   * Crea una nueva reserva.
   * @param createReservaDto DTO con la información de la reserva a crear.
   * @returns La reserva creada y guardada.
   */
  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservaService.create(createReservaDto);
  }

  /**
   * Obtiene la lista de todas las reservas registradas.
   * @returns Arreglo de todas las reservas con sus relaciones de calendario y usuario.
   */
  @Get()
  findAll() {
    return this.reservaService.findAll();
  }

  /**
   * Obtiene la disponibilidad de un espacio en una fecha específica.
   * @param idEspacio Identificador del espacio.
   * @param fecha Fecha a consultar.
   * @returns Objeto conteniendo el estado de disponibilidad del espacio.
   */
  @Get('disponibilidad/:idEspacio')
  async getDisponibilidad(
    @Param('idEspacio') idEspacio: number,
    @Query('fecha') fecha: string,
  ) {
    return this.reservaService.getDisponibilidadPorEspacioYFecha(
      idEspacio,
      fecha,
    );
  }

  /**
   * Obtiene una reserva específica por su ID.
   * @param id ID de la reserva a buscar.
   * @returns La reserva encontrada.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservaService.findOne(+id);
  }

  /**
   * Actualiza los datos de una reserva por su ID.
   * @param id ID de la reserva a actualizar.
   * @param updateReservaDto DTO con la información a modificar.
   * @returns La reserva con sus datos actualizados.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservaService.update(+id, updateReservaDto);
  }

  /**
   * Elimina una reserva del sistema por su ID.
   * @param id ID de la reserva a eliminar.
   * @returns Estado del resultado de la operación de borrado.
   */
  @Delete('eliminar/:id')
  remove(@Param('id') id: string) {
    return this.reservaService.remove(+id);
  }

  /**
   * Obtiene las reservas asociadas a un usuario según su correo electrónico.
   * @param email Correo electrónico del usuario.
   * @returns Arreglo de reservas pertenecientes al usuario.
   */
  @Get('byEmail/:email')
  findByEmail(@Param('email') email: string) {
    return this.reservaService.findByEmail(email);
  }

  /**
   * Actualiza la calificación y comentario de una reserva una vez finalizada.
   * @param id ID de la reserva.
   * @param calificacion Valor de la calificación numérica.
   * @param comentario Comentario descriptivo opcional sobre la reserva.
   * @returns Resultado de la actualización en base de datos.
   */
  @Patch('calificar/:id')
  updateCalificacion(
    @Param('id') id: number,
    @Body('calificacion') calificacion: number,
    @Body('comentario') comentario: string,
  ) {
    return this.reservaService.updateCalificacion(
      id,
      calificacion,
      comentario,
    );
  }

  /**
   * Actualiza las observaciones de entrega de una reserva de espacio.
   * @param id ID de la reserva.
   * @param observacionesEntrega Texto con los detalles u observaciones de entrega.
   * @returns Resultado de la actualización en base de datos.
   */
  @Patch('observaciones/:id')
  updateObservacionesEntrega(
    @Param('id') id: number,
    @Body('observacionesEntrega') observacionesEntrega: string,
  ) {
    return this.reservaService.updateObservacionesEntrega(id, observacionesEntrega);
  } 
}
