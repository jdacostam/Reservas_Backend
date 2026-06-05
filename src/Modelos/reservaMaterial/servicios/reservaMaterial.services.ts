import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservaMaterial } from '../../../database/Entidades/reservaMaterial.entity';
import { Material } from '../../../database/Entidades/material.entity';
import { Usuario } from '../../../database/Entidades/usuario.entity';
import { CreateReservaMaterialDto } from '../dto/create.dto';
import { UpdateReservaMaterialDto } from '../dto/update.dto';
import { EstadoReservaMaterial } from 'src/database/Entidades/reservaMaterial.entity';
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

  /**
   * Crea una nueva reserva de material usando una transacción.
   * Disminuye la cantidad disponible de materiales y guarda la reserva.
   * @param dto DTO con los detalles para la reserva del material.
   * @returns La reserva de material creada y guardada.
   * @throws Error si el material no existe o no tiene cantidad disponible suficiente.
   */
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
          `No hay suficiente cantidad disponible. Solo quedan ${material.cantidadDisponible} < ${dto.cantidad}.`,
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

  /**
   * Obtiene todas las reservas de materiales en el sistema.
   * @returns Lista de todas las reservas de materiales con relaciones de material y usuario.
   */
  findAll() {
    return this.reservaMaterialRepository.find({
      relations: ['material', 'usuario'],
    });
  }

  /**
   * Obtiene una única reserva de material por su ID.
   * @param id ID de la reserva.
   * @returns La reserva de material correspondiente o null si no se encuentra.
   */
  findOne(id: number) {
    return this.reservaMaterialRepository.findOne({ where: { id } });
  }

  /**
   * Obtiene las reservas de material de un usuario a partir de su correo electrónico.
   * @param email Correo electrónico del usuario.
   * @returns Lista de reservas de material con sus relaciones.
   */
  async findByEmail(email: string) {
    return this.reservaMaterialRepository.find({
      where: {
        usuario: { email },
      },
      relations: ['material', 'usuario'],
    });
  }

  /**
   * Actualiza la información de una reserva de material y sus relaciones si son especificadas.
   * @param id ID de la reserva.
   * @param dto DTO con los campos que se van a actualizar.
   * @returns La reserva de material actualizada.
   */
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

  /**
   * Remueve permanentemente una reserva de material.
   * @param id ID de la reserva a eliminar.
   * @returns Resultado del borrado de TypeORM.
   */
  remove(id: number) {
    return this.reservaMaterialRepository.delete(id);
  }

  /**
   * Modifica el estado de una reserva de material (obsoleto).
   * @param id ID de la reserva.
   * @param estado Estado de reserva.
   * @returns Resultado del update en base de datos.
   */
  updateHoraInicio(id: number, estado: EstadoReservaMaterial) {
    return this.reservaMaterialRepository.update(id, { estado });
  }

  /**
   * Realiza la transición de estado de una reserva de material (ej. de Pendiente a Entregado, o de Entregado a Devuelto).
   * Calcula automáticamente fechas límites basándose en el tiempo de préstamo del material o registra la fecha de devolución y hora de finalización.
   * @param id ID de la reserva.
   * @param estado Estado de destino deseado para la reserva.
   * @returns Resultado de la actualización en base de datos.
   * @throws Error si la transición de estado no es válida.
   */
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
        .add(reserva.material.tiempoPrestamo, 'day')
        .toDate();
      dataToUpdate.horaInicio = horaActual;
    } else if (
      reserva.estado === EstadoReservaMaterial.Entregado &&
      estado === EstadoReservaMaterial.Devuelto
    ) {
      dataToUpdate.fechaDevolucion = ahora;
      dataToUpdate.horaFin = horaActual;
    } else {
      throw new Error('Estado no válido para la transición');
    }

    return this.reservaMaterialRepository.update(id, dataToUpdate);
  }

  /**
   * Actualiza la calificación y el comentario al culminar una reserva de material.
   * @param id ID de la reserva de material.
   * @param calificacion Valor de calificación.
   * @param comentario Comentario descriptivo.
   * @returns Resultado de la actualización en base de datos.
   */
  updateCalificacion(id: number, calificacion: number, comentario?: string) {
    return this.reservaMaterialRepository.update(id, {
      calificacion,
      comentario,
    });
  }

  /**
   * Actualiza las observaciones generadas sobre la entrega del material.
   * @param id ID de la reserva de material.
   * @param observacionesEntrega Texto con observaciones.
   * @returns Resultado de la actualización en base de datos.
   */
  updateObservacionesEntrega(id: number, observacionesEntrega: string) {
    return this.reservaMaterialRepository.update(id, { observacionesEntrega });
  }
}
