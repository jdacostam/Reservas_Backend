import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Espacio } from '../../../database/Entidades/espacio.entity';
import { CreateEspacioDto } from '../dto/create.dto';
import { UpdateEspacioDto } from '../dto/update.dto';

@Injectable()
export class EspacioService {
  constructor(
    @InjectRepository(Espacio)
    private readonly espacioRepository: Repository<Espacio>,
  ) {}

  /**
   * Crea y guarda un nuevo espacio físico en la base de datos.
   * @param dto DTO con los detalles del espacio.
   * @returns El espacio guardado.
   */
  create(dto: CreateEspacioDto) {
    const nuevo = this.espacioRepository.create(dto);
    return this.espacioRepository.save(nuevo);
  }

  /**
   * Recupera todos los espacios físicos registrados.
   * @returns Arreglo de espacios.
   */
  findAll() {
    return this.espacioRepository.find();
  }

  /**
   * Busca un único espacio físico por su identificador.
   * @param id Identificador numérico del espacio.
   * @returns El espacio encontrado o null si no se encuentra.
   */
  findOne(id: number) {
    return this.espacioRepository.findOne({ where: { id } });
  }

  /**
   * Actualiza los datos de un espacio determinado y retorna su estado más reciente.
   * @param id Identificador numérico del espacio a actualizar.
   * @param dto DTO con la información de actualización.
   * @returns El espacio actualizado con los nuevos valores.
   */
  async update(id: number, dto: UpdateEspacioDto) {
    await this.espacioRepository.update(id, dto);
    return this.findOne(id);
  }

  /**
   * Elimina de forma permanente un espacio del registro.
   * @param id Identificador numérico del espacio.
   * @returns El resultado de la operación de eliminación de TypeORM.
   */
  remove(id: number) {
    return this.espacioRepository.delete(id);
  }
}
