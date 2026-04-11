import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TipoEspacio } from '../../../database/Entidades/espacio.entity';

export class CreateEspacioDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsEnum(TipoEspacio)
  tipo: TipoEspacio;

  @IsNotEmpty()
  @IsNumber()
  capacidad: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
