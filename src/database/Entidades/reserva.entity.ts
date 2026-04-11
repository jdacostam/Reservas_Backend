import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Calendario } from './calendario.entity';
import { Usuario } from './usuario.entity';
import { IsInt, Min, Max } from 'class-validator';

export enum EstadoReserva {
  ACTIVA = 'activa',
  CANCELADA = 'cancelada',
  COMPLETADA = 'completada',
  PENDIENTE = 'pendiente',
}

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Calendario, (calendario) => calendario.reservas, { eager: true })
  calendario: Calendario;

  @ManyToOne(() => Usuario, (usuario) => usuario.reservas, { eager: true })
  usuario: Usuario;

  @Column({
    type: 'enum',
    enum: EstadoReserva,
    default: EstadoReserva.PENDIENTE
  })
  estado: EstadoReserva;

  @CreateDateColumn()
  fechaReserva: Date;

  @IsInt()
  @Min(1)
  @Max(5)
  @Column({ nullable: true })
  calificacion: number;

  @Column({ nullable: true })
  comentario: string;
  
  @Column({ nullable: true })
  observacionesEntrega: string;
}