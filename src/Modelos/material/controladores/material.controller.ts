import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaterialService } from '../servicios/material.services';
import { CreateMaterialDto } from '../dto/create.dto';
import { UpdateMaterialDto } from '../dto/update.dto';

@Controller('materiales')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  /**
   * Crea un nuevo registro de material.
   * @param createMaterialDto DTO con la información de creación del material.
   * @returns El material creado y almacenado.
   */
  @Post()
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialService.create(createMaterialDto);
  }

  /**
   * Obtiene la lista completa de todos los materiales.
   * @returns Arreglo con la información de todos los materiales.
   */
  @Get()
  findAll() {
    return this.materialService.findAll();
  }

  /**
   * Obtiene la información de un material determinado por su ID.
   * @param id ID del material a buscar.
   * @returns El material correspondiente o null si no existe.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialService.findOne(+id);
  }

  /**
   * Actualiza la información de un material existente.
   * @param id ID del material a actualizar.
   * @param updateMaterialDto DTO con los campos que se van a modificar.
   * @returns El material con la información actualizada.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaterialDto: UpdateMaterialDto) {
    return this.materialService.update(+id, updateMaterialDto);
  }

  /**
   * Elimina un material del registro a partir de su ID.
   * @param id ID del material a remover.
   * @returns Estado de la operación de eliminación.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialService.remove(+id);
  }
}
