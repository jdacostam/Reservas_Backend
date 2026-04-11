import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Reserva } from './reserva.entity';
import { ReservaMaterial } from './reservaMaterial.entity';

export enum TipoUsuario {
  Estudiante = "Estudiante",
  Profesor = "Profesor",
  Externo = "Externo",
  Laborista = "Laborista"
}

@Entity()
export class Usuario {
  @PrimaryColumn({ type: 'varchar', length: 45 })
  email: string;

  @Column({ type: 'varchar', length: 45 })
  nombre: string;

  @Exclude()
  @Column({ type: 'varchar', length: 45 })
  password: string;

  @Column({ type: 'enum', enum: TipoUsuario })
  tipo: TipoUsuario;

  @Column({ type: 'varchar', length: 20, nullable: true })
  codigoEstudiantil: string;

  @Column({ type: 'varchar', length: 20 })
  cedula: string;

  @OneToMany(() => Reserva, (reserva) => reserva.usuario, {nullable: true})
  reservas: Reserva[];

  @OneToMany(() => ReservaMaterial, (reservaMaterial) => reservaMaterial.usuario, { nullable: true })
  reservasMaterial: ReservaMaterial[];
}
