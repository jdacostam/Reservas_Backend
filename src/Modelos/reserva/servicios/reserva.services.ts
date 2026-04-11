import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Reserva,
  EstadoReserva,
} from '../../../database/Entidades/reserva.entity';
import { CreateReservaDto } from '../dto/create.dto';
import { UpdateReservaDto } from '../dto/update.dto';
import { Calendario } from '../../../database/Entidades/calendario.entity';
import { Usuario } from '../../../database/Entidades/usuario.entity';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,

    @InjectRepository(Calendario)
    private readonly calendarioRepository: Repository<Calendario>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(dto: CreateReservaDto) {
    const calendario = await this.calendarioRepository.findOne({
      where: { id: dto.calendarioId },
    });
    if (!calendario) throw new NotFoundException('Calendario no encontrado');

    if (calendario.capacidad < 1) throw new NotFoundException('No hay cupos');

    const usuario = await this.usuarioRepository.findOne({
      where: { email: dto.usuarioId },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const reserva = this.reservaRepository.create({
      calendario,
      usuario,
      estado: dto.estado ?? EstadoReserva.PENDIENTE,
      calificacion: dto.calificacion,
      comentario: dto.comentario,
      observacionesEntrega: dto.observacionesEntrega,
    });

    const capacidadNueva = calendario.capacidad - 1;
    var disponible = true;
    var docente = false;
    if (capacidadNueva === 0) disponible = false;

    if (String(usuario.tipo) === 'Profesor') {
      disponible = false;
      docente = true;
    }

    await this.calendarioRepository.update(
      { id: calendario.id },
      {
        capacidad: capacidadNueva,
        disponibilidad: disponible,
        docenteAsignado: docente,
      },
    );

    if (calendario.capacidad === 0) {
      await this.calendarioRepository.update(
        { id: calendario.id },
        { disponibilidad: false },
      );
    }

    return this.reservaRepository.save(reserva);
  }

  findAll() {
    return this.reservaRepository.find({
      relations: ['calendario', 'usuario'],
    });
  }

  findOne(id: number) {
    return this.reservaRepository.findOne({
      where: { id },
      relations: ['calendario', 'usuario'],
    });
  }

  async findByEmail(email: string) {
    return this.reservaRepository.find({
      where: { usuario: { email } },
      relations: ['calendario', 'usuario'],
    });
  }

  async update(id: number, dto: UpdateReservaDto) {
    const reserva = await this.reservaRepository.findOne({ where: { id } });
    if (!reserva) return null;

    if (dto.calendarioId) {
      const calendario = await this.calendarioRepository.findOne({
        where: { id: dto.calendarioId },
      });
      if (!calendario) throw new NotFoundException('Calendario no encontrado');
      reserva.calendario = calendario;
    }

    if (dto.usuarioId) {
      const usuario = await this.usuarioRepository.findOne({
        where: { email: dto.usuarioId },
      });
      if (!usuario) throw new NotFoundException('Usuario no encontrado');
      reserva.usuario = usuario;
    }

    reserva.estado = dto.estado ?? reserva.estado;
    reserva.calificacion = dto.calificacion ?? reserva.calificacion;
    reserva.comentario = dto.comentario ?? reserva.comentario;
    reserva.observacionesEntrega =
      dto.observacionesEntrega ?? reserva.observacionesEntrega;

    return this.reservaRepository.save(reserva);
  }

  async getDisponibilidadPorEspacioYFecha(espacioId: number, fecha: string) {
    // Buscar calendarios para ese espacio y fecha
    const calendarios = await this.calendarioRepository.find({
      where: {
        espacio: { id: espacioId },
        fecha,
      },
      relations: ['reservas'],
    });

    const disponibilidad = calendarios.map((c) => ({
      calendarioId: c.id,
      horaInicio: c.horaInicio,
      horaFin: c.horaFin,
      disponible: c.disponibilidad,
      capacidad: c.capacidad,
      reservas:
        c.reservas?.map((r) => ({
          reservaId: r.id,
          usuarioNombre: r.usuario?.nombre || 'Desconocido',
        })) || [],
      docenteAsignado: c.docenteAsignado,
    }));

    return { disponibilidad };
  }

  remove(id: number) {
    return this.reservaRepository.delete(id);
  }

  updateCalificacion(id: number, calificacion: number, comentario?: string) {
    return this.reservaRepository.update(id, { calificacion, comentario });
  }

  updateObservacionesEntrega(id: number, observacionesEntrega: string) {
    return this.reservaRepository.update(id, { observacionesEntrega });
  }
}
