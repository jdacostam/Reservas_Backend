import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from '../../../database/Entidades/material.entity';
import { CreateMaterialDto } from '../dto/create.dto';
import { UpdateMaterialDto } from '../dto/update.dto';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  /**
   * Crea y almacena un nuevo recurso material en la base de datos.
   * @param dto DTO con los detalles del material a crear.
   * @returns El material guardado.
   */
  create(dto: CreateMaterialDto) {
    const nuevo = this.materialRepository.create(dto);
    return this.materialRepository.save(nuevo);
  }

  /**
   * Obtiene la lista completa de todos los recursos materiales.
   * @returns Arreglo con todos los registros de materiales.
   */
  findAll() {
    return this.materialRepository.find();
  }

  /**
   * Obtiene un recurso material por su identificador único.
   * @param id Identificador numérico del material.
   * @returns El material encontrado o null si no existe.
   */
  findOne(id: number) {
    return this.materialRepository.findOne({ where: { id } });
  }

  /**
   * Modifica y actualiza la información de un recurso material existente.
   * @param id Identificador del material.
   * @param dto DTO con la información que se desea actualizar.
   * @returns El material con la información ya actualizada.
   */
  async update(id: number, dto: UpdateMaterialDto) {
    await this.materialRepository.update(id, dto);
    return this.findOne(id);
  }

  /**
   * Elimina permanentemente del registro un recurso material específico.
   * @param id Identificador numérico del material.
   * @returns El resultado de la operación de borrado.
   */
  remove(id: number) {
    return this.materialRepository.delete(id);
  }
}
