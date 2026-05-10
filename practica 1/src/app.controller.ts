import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

class CreateItemDto {
  name: string;
  description: string;
}

@ApiTags('Items') 
@Controller('items')
export class AppController {

  @Get()
  @ApiOperation({ summary: 'Obtener todos los items' })
  @ApiResponse({ status: 200, description: 'Lista de items devuelta exitosamente.' })
  getAll() {
    return [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo item' })
  @ApiResponse({ status: 201, description: 'El item ha sido creado.' })
  create(@Body() createItemDto: CreateItemDto) {
    return { id: 3, ...createItemDto };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un item por ID' })
  @ApiParam({ name: 'id', description: 'ID único del item' })
  getOne(@Param('id') id: string) {
    return { id: Number(id), name: `Item ${id}` };
  }
}