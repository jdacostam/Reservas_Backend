import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CalendarioService } from '../servicios/calendario.service';
import { CreateCalendarioDto } from '../dto/create.dto';
import { UpdateCalendarioDto } from '../dto/update.dto';

@Controller('calendario')
export class CalendarioController {
  constructor(private readonly calendarioService: CalendarioService) {}

  @Post()
  create(@Body() createCalendarioDto: CreateCalendarioDto) {
    return this.calendarioService.create(createCalendarioDto);
  }

  @Get()
  findAll() {
    return this.calendarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarioService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCalendarioDto: UpdateCalendarioDto,
  ) {
    return this.calendarioService.update(+id, updateCalendarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarioService.remove(+id);
  }
}
