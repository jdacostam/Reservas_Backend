import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CalendarioService } from '../servicios/calendario.service';
import { CreateCalendarioDto } from '../dto/create.dto';
import { UpdateCalendarioDto } from '../dto/update.dto';

@Controller('calendario')
export class CalendarioController {
  constructor(private readonly calendarioService: CalendarioService) {}

  /**
   * Crea un nuevo registro de calendario.
   * @param createCalendarioDto DTO con los datos de creación del calendario.
   * @returns El objeto de calendario creado y guardado.
   */
  @Post()
  create(@Body() createCalendarioDto: CreateCalendarioDto) {
    return this.calendarioService.create(createCalendarioDto);
  }

  /**
   * Obtiene todos los registros de calendario.
   * @returns Arreglo de todos los calendarios.
   */
  @Get()
  findAll() {
    return this.calendarioService.findAll();
  }

  /**
   * Obtiene un registro de calendario específico por su ID.
   * @param id ID del calendario a buscar.
   * @returns El calendario encontrado.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarioService.findOne(+id);
  }

  /**
   * Actualiza un registro de calendario por su ID.
   * @param id ID del calendario a actualizar.
   * @param updateCalendarioDto DTO con los campos a modificar.
   * @returns El calendario actualizado.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCalendarioDto: UpdateCalendarioDto,
  ) {
    return this.calendarioService.update(+id, updateCalendarioDto);
  }

  /**
   * Elimina un registro de calendario por su ID.
   * @param id ID del calendario a remover.
   * @returns Promesa vacía indicando la eliminación.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarioService.remove(+id);
  }
}
