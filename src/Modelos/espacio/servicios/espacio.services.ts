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

  create(dto: CreateEspacioDto) {
    const nuevo = this.espacioRepository.create(dto);
    return this.espacioRepository.save(nuevo);
  }

  findAll() {
    return this.espacioRepository.find();
  }

  findOne(id: number) {
    return this.espacioRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateEspacioDto) {
    await this.espacioRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.espacioRepository.delete(id);
  }
}
