import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Espacio } from './espacio.entity';
import { Reserva } from './reserva.entity';
import { join } from 'path';

export enum TipoEspacio {
  AULA = 'Aula',
  LAB_COMP = 'Laboratorio de Computación',
  LAB_FISICA = 'Laboratorio de Física',
  AUDITORIO = 'Auditorio',
}

@Entity()
export class Calendario {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  fecha: string;

  @Column()
  horaInicio: string;

  @Column()
  horaFin: string;

  @Column()
  capacidad: number;

  @Column()
  disponibilidad: boolean;

  @Column({nullable:true})
  docenteAsignado: boolean;

  @ManyToOne(() => Espacio, (espacio) => espacio.calendario, { eager: true })
  espacio: Espacio;

  @OneToMany(() => Reserva, (reserva) => reserva.calendario, { nullable: true })
  reservas: Reserva[];
}
