import {
  Controller, Get, Param, ParseIntPipe, Query,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery,
} from '@nestjs/swagger';
import { BreedsService } from './breeds.service';
import { BreedResponseDto } from './dto/breed.dto';

@ApiTags('Razas de Perros')
@Controller('breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) { }

  @Get()
  @ApiOperation({
    summary: 'Listar todas las razas',
    description: 'Devuelve una lista paginada de todas las razas de perros disponibles.',
  })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Cantidad de resultados' })
  @ApiQuery({ name: 'page', required: false, example: 0, description: 'Número de página' })
  @ApiResponse({ status: 200, description: 'Lista de razas obtenida exitosamente', type: [BreedResponseDto] })
  @ApiResponse({ status: 502, description: 'Error al conectar con la API externa' })
  findAll(
    @Query('limit') limit = 10,
    @Query('page') page = 0,
  ) {
    return this.breedsService.findAll(Number(limit), Number(page));
  }

  @Get('search')
  @ApiOperation({
    summary: 'Buscar raza por nombre',
    description: 'Busca razas que coincidan con el nombre proporcionado.',
  })
  @ApiQuery({ name: 'q', required: true, example: 'labrador', description: 'Nombre o parte del nombre de la raza' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda', type: [BreedResponseDto] })
  search(@Query('q') q: string) {
    return this.breedsService.search(q);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener raza por ID',
    description: 'Retorna la información detallada de una raza específica.',
  })
  @ApiParam({ name: 'id', description: 'ID numérico de la raza', example: 1 })
  @ApiResponse({ status: 200, description: 'Raza encontrada', type: BreedResponseDto })
  @ApiResponse({ status: 404, description: 'Raza no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.breedsService.findOne(id);
  }
}
