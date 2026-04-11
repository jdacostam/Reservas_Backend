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

  async create(createCalendarioDto: CreateCalendarioDto): Promise<Calendario> {
    
    const espacio = await this.espacioRepository.findOne({
      where: { id: createCalendarioDto.espacioId },
    });
    
    if (!espacio) {
      throw new NotFoundException('Espacio no encontrado');
    }

    const calendarioExistente=await this.getCalendarioEspacioHorario(espacio.id, createCalendarioDto.fecha, createCalendarioDto.horaInicio)
  if (calendarioExistente.length > 0) {
    // Vuelves a buscarlo con relaciones si es necesario
    return this.calendarioRepository.findOne({
      where: { id: calendarioExistente[0].id },
      relations: ['espacio'], // agrega otras relaciones si necesitas
    });
  }

    const calendario = this.calendarioRepository.create({
      ...createCalendarioDto,
      espacio,
    });

    return this.calendarioRepository.save(calendario);
  }

  findAll(): Promise<Calendario[]> {
    return this.calendarioRepository.find();
  }

  async findOne(id: number): Promise<Calendario> {
    const calendario = await this.calendarioRepository.findOne({
      where: { id },
    });

    if (!calendario) {
      throw new NotFoundException('Calendario no encontrado');
    }

    return calendario;
  }

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

  async remove(id: number): Promise<void> {
    await this.calendarioRepository.delete(id);
  }

  async getDisponibilidadPorEspacioYFecha(espacioId: number, fecha: string) {
    // Buscar calendarios para ese espacio y fecha
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

  async getCalendarioEspacioHorario(espacioId: number, fecha: string, horaInicio: string) {
    // Buscar calendarios para ese espacio y fecha
    const calendario = await this.calendarioRepository.find({
      where: {
        espacio: { id: espacioId },
        fecha,
        horaInicio
      }
    });
    return calendario
  }
}
