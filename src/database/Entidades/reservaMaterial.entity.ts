import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Material } from './material.entity';
import { Usuario } from './usuario.entity';
import { IsInt, Min, Max } from 'class-validator';

export enum EstadoReservaMaterial {
  Pendiente = 'Pendiente',
  Entregado = 'Entregado',
  Devuelto = 'Devuelto',
  Atrasado = 'Atrasado',
}

@Entity()
export class ReservaMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Material, { eager: true })
  material: Material;

  @ManyToOne(() => Usuario, (usuario) => usuario.reservasMaterial, {
    nullable: true,
  })
  usuario: Usuario;

  @Column()
  cantidad: number;

  @Column()
  fecha: string; // YYYY-MM-DD

  @Column({ nullable: true })
  horaInicio?: string; // HH:mm

  @Column({ nullable: true })
  horaFin?: string; // HH:mm

  @CreateDateColumn()
  fechaReserva: Date;

  @Column({ nullable: true })
  fechaDevolucion?: Date;

  @Column({ nullable: true })
  fechaLimite?: Date;

  @Column({
    type: 'enum',
    enum: EstadoReservaMaterial,
    default: EstadoReservaMaterial.Pendiente,
  })
  estado: EstadoReservaMaterial;

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
