import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EspacioService } from '../servicios/espacio.services';
import { CreateEspacioDto } from '../dto/create.dto';
import { UpdateEspacioDto } from '../dto/update.dto';

@Controller('espacios')
export class EspacioController {
  constructor(private readonly espacioService: EspacioService) {}

  /**
   * Crea un nuevo espacio en el sistema.
   * @param createEspacioDto DTO con la información de creación del espacio.
   * @returns El objeto del espacio creado y guardado.
   */
  @Post()
  create(@Body() createEspacioDto: CreateEspacioDto) {
    return this.espacioService.create(createEspacioDto);
  }

  /**
   * Obtiene la lista completa de todos los espacios.
   * @returns Arreglo de espacios.
   */
  @Get()
  findAll() {
    return this.espacioService.findAll();
  }

  /**
   * Obtiene la información de un espacio específico por su ID.
   * @param id ID del espacio a buscar.
   * @returns El espacio encontrado o null si no existe.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.espacioService.findOne(+id);
  }

  /**
   * Actualiza la información de un espacio por su ID.
   * @param id ID del espacio a actualizar.
   * @param updateEspacioDto DTO con los campos a modificar.
   * @returns El espacio actualizado.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEspacioDto: UpdateEspacioDto) {
    return this.espacioService.update(+id, updateEspacioDto);
  }

  /**
   * Elimina un espacio físico del sistema.
   * @param id ID del espacio a remover.
   * @returns Estado de la operación de eliminación.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.espacioService.remove(+id);
  }
}
