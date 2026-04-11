import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservaMaterial } from '../../../database/Entidades/reservaMaterial.entity';
import { Material } from '../../../database/Entidades/material.entity';
import { Usuario } from '../../../database/Entidades/usuario.entity';
import { CreateReservaMaterialDto } from '../dto/create.dto';
import { UpdateReservaMaterialDto } from '../dto/update.dto';
import { EstadoReservaMaterial } from 'src/database/Entidades/reservaMaterial.entity';
//import { format } from 'date-fns';
import * as dayjs from 'dayjs';
import { DataSource } from 'typeorm';

@Injectable()
export class ReservaMaterialService {
  constructor(
    @InjectRepository(ReservaMaterial)
    private readonly reservaMaterialRepository: Repository<ReservaMaterial>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly dataSource: DataSource,
  ) {}

async create(dto: CreateReservaMaterialDto) {
  return await this.dataSource.transaction(async (manager) => {
    const materialRepo = manager.getRepository(Material);
    const reservaRepo = manager.getRepository(ReservaMaterial);

    const material = await materialRepo.findOne({
      where: { id: dto.materialId },
    });

    if (!material) {
      throw new Error('Material no encontrado');
    }

    if (material.cantidadDisponible < dto.cantidad) {
      throw new Error(
        `No hay suficiente cantidad disponible. Solo quedan ${material.cantidadDisponible} < ${dto.cantidad}.`
      );
    }

    material.cantidadDisponible -= dto.cantidad;
    await materialRepo.save(material);

    const reserva = reservaRepo.create({
      material,
      cantidad: dto.cantidad,
      fecha: dto.fecha,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
    });

    if (dto.usuarioId) {
      reserva.usuario = await manager.getRepository(Usuario).findOne({
        where: { email: dto.usuarioId },
      });
    }

    return await reservaRepo.save(reserva);
  });
}


  findAll() {
    return this.reservaMaterialRepository.find({
      relations: ['material', 'usuario'],
    });
  }

  findOne(id: number) {
    return this.reservaMaterialRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.reservaMaterialRepository.find({
      where: {
        usuario: { email },
      },
      relations: ['material', 'usuario'],
    });
  }

  async update(id: number, dto: UpdateReservaMaterialDto) {
    const reserva = await this.findOne(id);
    if (dto.materialId) {
      reserva.material = await this.materialRepository.findOne({
        where: { id: dto.materialId },
      });
    }
    if (dto.usuarioId) {
      reserva.usuario = await this.usuarioRepository.findOne({
        where: { email: dto.usuarioId },
      });
    }
    Object.assign(reserva, dto);
    return this.reservaMaterialRepository.save(reserva);
  }

  remove(id: number) {
    return this.reservaMaterialRepository.delete(id);
  }

  //updateEstado(id: number, estado: EstadoReservaMaterial) {
  //  return this.reservaMaterialRepository.update(id, { estado });
  //}

  updateHoraInicio(id: number, estado: EstadoReservaMaterial) {
    return this.reservaMaterialRepository.update(id, { estado });
  }

async updateEstado(id: number, estado: EstadoReservaMaterial) {
  const ahora = new Date();
  const horaActual = ahora.toTimeString().slice(0, 5);
  const dataToUpdate: Partial<ReservaMaterial> = { estado };
  const reserva = await this.findOne(id);

  if (
    reserva.estado === EstadoReservaMaterial.Pendiente &&
    estado === EstadoReservaMaterial.Entregado
  ) {
    dataToUpdate.fechaLimite = dayjs()
      .add(reserva.material.tiempoPrestamo, "day")
      .toDate();
    dataToUpdate.horaInicio = horaActual;
  } else if (
    reserva.estado === EstadoReservaMaterial.Entregado &&
    estado === EstadoReservaMaterial.Devuelto
  ) {
    dataToUpdate.fechaDevolucion = ahora;
    dataToUpdate.horaFin = horaActual;
  } else {
    throw new Error("Estado no válido para la transición");
  }

  return this.reservaMaterialRepository.update(id, dataToUpdate);
}

  updateCalificacion(id: number, calificacion: number, comentario?: string) {
    return this.reservaMaterialRepository.update(id, { calificacion , comentario});
  }

  updateObservacionesEntrega(
    id: number,
    observacionesEntrega: string,
  ){
    return this.reservaMaterialRepository.update(id, { observacionesEntrega });
  }
}
