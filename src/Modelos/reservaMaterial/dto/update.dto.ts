// src/dto/update.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateReservaMaterialDto } from './create.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateReservaMaterialDto extends PartialType(CreateReservaMaterialDto) {
  @IsOptional()
  @IsString()
  observacionesEntrega?: string;
}
