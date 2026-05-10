import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DogsService } from './dogs.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';

@ApiTags('Base de Datos Local (SQLite)')
@Controller('internal-dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo perro' })
  @ApiResponse({ status: 201, description: 'Perro creado con éxito' })
  create(@Body() createDogDto: CreateDogDto) {
    return this.dogsService.create(createDogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los perros guardados' })
  findAll() {
    return this.dogsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un perro por ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dogsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar datos de un perro' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDogDto: UpdateDogDto) {
    return this.dogsService.update(id, updateDogDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un perro' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dogsService.remove(id);
  }
}
