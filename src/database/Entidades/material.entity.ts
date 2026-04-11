import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ReservaMaterial } from './reservaMaterial.entity';
@Entity()
export class Material {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  nombre: string;

  @Column()
  cantidad: number;

  @Column()
  tiempoPrestamo?: number;

  @Column()
  cantidadDisponible: number;

  @OneToMany(() => ReservaMaterial, (reservaMaterial) => reservaMaterial.material, { nullable: true })  
  reservas: ReservaMaterial[];
}
