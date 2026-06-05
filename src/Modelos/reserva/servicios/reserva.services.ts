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

  /**
   * Crea una reserva de espacio en la base de datos.
   * Valida existencia del calendario, disponibilidad de cupos y tipo de usuario para aplicar reglas de reserva.
   * @param dto DTO con los datos para crear la reserva.
   * @returns La reserva guardada.
   * @throws NotFoundException si el calendario o usuario no son encontrados, o si no hay cupos.
   */
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

  /**
   * Obtiene todas las reservas registradas.
   * @returns Arreglo de todas las reservas con sus relaciones de calendario y usuario.
   */
  findAll() {
    return this.reservaRepository.find({
      relations: ['calendario', 'usuario'],
    });
  }

  /**
   * Busca una única reserva por su ID.
   * @param id ID de la reserva.
   * @returns La reserva encontrada.
   */
  findOne(id: number) {
    return this.reservaRepository.findOne({
      where: { id },
      relations: ['calendario', 'usuario'],
    });
  }

  /**
   * Busca todas las reservas asociadas al correo de un usuario específico.
   * @param email Correo electrónico del usuario.
   * @returns Arreglo de reservas del usuario.
   */
  async findByEmail(email: string) {
    return this.reservaRepository.find({
      where: { usuario: { email } },
      relations: ['calendario', 'usuario'],
    });
  }

  /**
   * Actualiza la información de una reserva existente.
   * @param id ID de la reserva.
   * @param dto DTO con los nuevos datos a modificar.
   * @returns La reserva con sus datos actualizados o null si no se encuentra.
   */
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

  /**
   * Obtiene el listado de disponibilidad y detalles de reservas de un espacio y fecha específicos.
   * @param espacioId ID del espacio físico.
   * @param fecha Fecha de consulta.
   * @returns Objeto de disponibilidad detallada.
   */
  async getDisponibilidadPorEspacioYFecha(espacioId: number, fecha: string) {
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

  /**
   * Elimina permanentemente una reserva por su ID.
   * @param id ID de la reserva a eliminar.
   * @returns Resultado del borrado de TypeORM.
   */
  remove(id: number) {
    return this.reservaRepository.delete(id);
  }

  /**
   * Actualiza únicamente la calificación y el comentario de una reserva.
   * @param id ID de la reserva.
   * @param calificacion Valor de calificación.
   * @param comentario Comentario descriptivo opcional.
   * @returns Resultado del update en base de datos.
   */
  updateCalificacion(id: number, calificacion: number, comentario?: string) {
    return this.reservaRepository.update(id, { calificacion, comentario });
  }

  /**
   * Actualiza únicamente las observaciones sobre la entrega de una reserva.
   * @param id ID de la reserva.
   * @param observacionesEntrega Texto de las observaciones de entrega.
   * @returns Resultado del update en base de datos.
   */
  updateObservacionesEntrega(id: number, observacionesEntrega: string) {
    return this.reservaRepository.update(id, { observacionesEntrega });
  }
}
