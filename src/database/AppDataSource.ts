import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Usuario } from './Entidades/usuario.entity';
import { Espacio } from './Entidades/espacio.entity';
import { Reserva } from './Entidades/reserva.entity';
import { Material } from './Entidades/material.entity';
import { ReservaMaterial } from './Entidades/reservaMaterial.entity';
import { Calendario } from './Entidades/calendario.entity';

config({ path: '.dev.env' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USUARIO || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'reservas',
  schema: 'public',
  synchronize: false,
  logging: false,
  entities: [Espacio, Reserva, Usuario, Material, ReservaMaterial, Calendario],
  migrations: ['src/database/migrations/*.ts'],
});