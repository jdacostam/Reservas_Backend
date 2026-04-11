import { PartialType } from '@nestjs/mapped-types';
import { CreateReservaDto } from './create.dto';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {}
