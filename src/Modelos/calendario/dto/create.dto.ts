import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCalendarioDto {
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  horaInicio: string;

  @IsString()
  @IsNotEmpty()
  horaFin: string;

  @IsInt()
  @IsNotEmpty()
  capacidad: number;

  @IsBoolean()
  @IsNotEmpty()
  disponibilidad: boolean;

  @IsNotEmpty()
  @IsInt()
  espacioId: number;
}
