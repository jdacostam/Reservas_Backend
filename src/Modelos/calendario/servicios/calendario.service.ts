import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calendario } from '../../../database/Entidades/calendario.entity';
import { CreateCalendarioDto } from '../dto/create.dto';
import { UpdateCalendarioDto } from '../dto/update.dto';
import { Espacio } from '../../../database/Entidades/espacio.entity';

@Injectable()
export class CalendarioService {
  constructor(
    @InjectRepository(Calendario)
    private calendarioRepository: Repository<Calendario>,

    @InjectRepository(Espacio)
    private espacioRepository: Repository<Espacio>,
  ) {}

  /**
   * Crea una nueva entrada en el calendario. Valida la existencia del espacio
   * y comprueba si ya existe un calendario programado para ese espacio en esa misma fecha y hora.
   * @param createCalendarioDto DTO con los detalles del calendario.
   * @returns El calendario creado o el existente ya registrado.
   */
  async create(createCalendarioDto: CreateCalendarioDto): Promise<Calendario> {
    const espacio = await this.espacioRepository.findOne({
      where: { id: createCalendarioDto.espacioId },
    });
    
    if (!espacio) {
      throw new NotFoundException('Espacio no encontrado');
    }

    const calendarioExistente = await this.getCalendarioEspacioHorario(espacio.id, createCalendarioDto.fecha, createCalendarioDto.horaInicio);
    if (calendarioExistente.length > 0) {
      return this.calendarioRepository.findOne({
        where: { id: calendarioExistente[0].id },
        relations: ['espacio'],
      });
    }

    const calendario = this.calendarioRepository.create({
      ...createCalendarioDto,
      espacio,
    });

    return this.calendarioRepository.save(calendario);
  }

  /**
   * Recupera todos los calendarios almacenados.
   * @returns Una lista con todos los registros de calendario.
   */
  findAll(): Promise<Calendario[]> {
    return this.calendarioRepository.find();
  }

  /**
   * Recupera un calendario específico por su ID.
   * @param id ID del calendario.
   * @returns El objeto de calendario encontrado.
   * @throws NotFoundException si el calendario no existe.
   */
  async findOne(id: number): Promise<Calendario> {
    const calendario = await this.calendarioRepository.findOne({
      where: { id },
    });

    if (!calendario) {
      throw new NotFoundException('Calendario no encontrado');
    }

    return calendario;
  }

  /**
   * Actualiza los datos de un calendario existente.
   * @param id ID del calendario.
   * @param updateDto DTO con los datos modificados.
   * @returns El calendario actualizado.
   * @throws NotFoundException si el espacio de reemplazo no es encontrado.
   */
  async update(
    id: number,
    updateDto: UpdateCalendarioDto,
  ): Promise<Calendario> {
    const calendario = await this.findOne(id);

    if (updateDto.espacioId) {
      const espacio = await this.espacioRepository.findOne({
        where: { id: updateDto.espacioId },
      });
      if (!espacio) {
        throw new NotFoundException('Espacio no encontrado');
      }
      calendario.espacio = espacio;
    }

    Object.assign(calendario, updateDto);

    return this.calendarioRepository.save(calendario);
  }

  /**
   * Elimina un registro de calendario por su ID.
   * @param id ID del calendario a eliminar.
   */
  async remove(id: number): Promise<void> {
    await this.calendarioRepository.delete(id);
  }

  /**
   * Obtiene la disponibilidad, capacidad y reservas de un espacio determinado en una fecha específica.
   * @param espacioId ID del espacio.
   * @param fecha Fecha a consultar.
   * @returns Objeto con un arreglo de disponibilidad.
   */
  async getDisponibilidadPorEspacioYFecha(espacioId: number, fecha: string) {
    const calendarios = await this.calendarioRepository.find({
      where: {
        espacio: { id: espacioId },
        fecha,
      }
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
    }));

    return { disponibilidad };
  }

  /**
   * Busca registros de calendario específicos que coincidan con un espacio, fecha y hora de inicio.
   * @param espacioId ID del espacio.
   * @param fecha Fecha a buscar.
   * @param horaInicio Hora de inicio a buscar.
   * @returns Arreglo de calendarios encontrados.
   */
  async getCalendarioEspacioHorario(espacioId: number, fecha: string, horaInicio: string) {
    const calendario = await this.calendarioRepository.find({
      where: {
        espacio: { id: espacioId },
        fecha,
        horaInicio
      }
    });
    return calendario;
  }
}
