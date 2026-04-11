import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMaterialDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @IsNotEmpty()
  @IsNumber()
  tiempoPrestamo?: number;

  @IsNotEmpty()
  @IsNumber()
  cantidadDisponible: number;
}
