import { PartialType } from '@nestjs/mapped-types';
import { CreateEspacioDto } from './create.dto';

export class UpdateEspacioDto extends PartialType(CreateEspacioDto) {}
