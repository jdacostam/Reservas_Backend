import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EstadoReserva } from '../../../database/Entidades/reserva.entity';

export class CreateReservaDto {
  @IsInt()
  calendarioId: number;

  @IsString()
  @IsNotEmpty()
  usuarioId: string;

  @IsEnum(EstadoReserva)
  @IsOptional()
  estado?: EstadoReserva;

  @IsInt()
  @IsOptional()
  calificacion?: number;

  @IsString()
  @IsOptional()
  comentario?: string;

  @IsString()
  @IsOptional()
  observacionesEntrega?: string;
}
