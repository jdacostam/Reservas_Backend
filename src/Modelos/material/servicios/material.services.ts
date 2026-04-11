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

  create(dto: CreateMaterialDto) {
    const nuevo = this.materialRepository.create(dto);
    return this.materialRepository.save(nuevo);
  }

  findAll() {
    return this.materialRepository.find();
  }

  findOne(id: number) {
    return this.materialRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateMaterialDto) {
    await this.materialRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.materialRepository.delete(id);
  }
}
