import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EspacioService } from '../servicios/espacio.services';
import { CreateEspacioDto } from '../dto/create.dto';
import { UpdateEspacioDto } from '../dto/update.dto';

@Controller('espacios')
export class EspacioController {
  constructor(private readonly espacioService: EspacioService) {}

  @Post()
  create(@Body() createEspacioDto: CreateEspacioDto) {
    return this.espacioService.create(createEspacioDto);
  }

  @Get()
  findAll() {
    return this.espacioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.espacioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEspacioDto: UpdateEspacioDto) {
    return this.espacioService.update(+id, updateEspacioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.espacioService.remove(+id);
  }
}
