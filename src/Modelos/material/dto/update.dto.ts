import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialDto } from './create.dto';

export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {
    
}
