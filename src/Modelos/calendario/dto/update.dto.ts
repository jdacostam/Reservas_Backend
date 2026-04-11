import { PartialType } from '@nestjs/mapped-types';
import { CreateCalendarioDto } from './create.dto';

export class UpdateCalendarioDto extends PartialType(CreateCalendarioDto) {}
