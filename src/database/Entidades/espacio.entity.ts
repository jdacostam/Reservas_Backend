import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Calendario } from './calendario.entity';

export enum TipoEspacio {
  AULA = 'Aula',
  LAB_COMP = 'Laboratorio de Computación',
  LAB_FISICA = 'Laboratorio de Física',
  AUDITORIO = 'Auditorio',
}

@Entity()
export class Espacio {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number; 

  @Column()
  nombre: string;

  @Column({
    type: 'enum',
    enum: TipoEspacio,
  })
  tipo: TipoEspacio;

  @Column()
  capacidad: number;

  @Column({ nullable: true })
  descripcion: string;

  @OneToMany(() => Calendario, (calendario) => calendario.espacio, {nullable: true })
  calendario: Calendario[];
}