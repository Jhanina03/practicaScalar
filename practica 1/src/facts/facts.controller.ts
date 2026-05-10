import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FactsService } from './facts.service';
import { DogBreedListResponseDto, DogBreedImageResponseDto } from './dto/fact.dto';

@ApiTags('Dog.CEO - Razas e Imágenes')
@Controller('dogs')
export class FactsController {
  constructor(private readonly factsService: FactsService) {}

  @Get('image/random')
  @ApiOperation({
    summary: 'Imagen aleatoria de cualquier raza',
    description: 'Obtiene una URL de imagen aleatoria de perro desde dog.ceo.',
  })
  @ApiResponse({ status: 200, description: 'URL de imagen aleatoria obtenida' })
  getRandomImage() {
    return this.factsService.getRandomImage();
  }

  @Get('image/random/:count')
  @ApiOperation({
    summary: 'Múltiples imágenes aleatorias',
    description: 'Obtiene N URLs de imágenes aleatorias de perros. Máximo 50.',
  })
  @ApiParam({ name: 'count', description: 'Cantidad de imágenes', example: 5 })
  @ApiResponse({ status: 200, description: 'Lista de URLs de imágenes' })
  getRandomImages(@Param('count', ParseIntPipe) count: number) {
    return this.factsService.getRandomImages(count);
  }

  @Get('breeds')
  @ApiOperation({
    summary: 'Listar todas las razas disponibles',
    description: 'Retorna todas las razas y sub-razas disponibles en dog.ceo con conteo total.',
  })
  @ApiResponse({ status: 200, description: 'Lista completa de razas', type: DogBreedListResponseDto })
  getAllBreeds() {
    return this.factsService.getAllBreeds();
  }

  @Get('breeds/:breed/images')
  @ApiOperation({
    summary: 'Imágenes de una raza específica',
    description: 'Retorna imágenes de perros de la raza indicada. El nombre debe estar en inglés y minúsculas.',
  })
  @ApiParam({ name: 'breed', description: 'Nombre de la raza en inglés', example: 'labrador' })
  @ApiQuery({ name: 'count', required: false, example: 5, description: 'Cantidad de imágenes (máx. 50)' })
  @ApiResponse({ status: 200, description: 'Imágenes de la raza obtenidas', type: DogBreedImageResponseDto })
  @ApiResponse({ status: 404, description: 'Raza no encontrada' })
  getBreedImages(
    @Param('breed') breed: string,
    @Query('count') count = 5,
  ) {
    return this.factsService.getBreedImages(breed.toLowerCase(), Number(count));
  }

  @Get('breeds/:breed/:subBreed/images')
  @ApiOperation({
    summary: 'Imágenes de una sub-raza',
    description: 'Retorna imágenes de una sub-raza específica. Ejemplo: breed=bulldog, subBreed=french.',
  })
  @ApiParam({ name: 'breed', description: 'Raza principal', example: 'bulldog' })
  @ApiParam({ name: 'subBreed', description: 'Sub-raza', example: 'french' })
  @ApiQuery({ name: 'count', required: false, example: 5, description: 'Cantidad de imágenes' })
  @ApiResponse({ status: 200, description: 'Imágenes de la sub-raza obtenidas' })
  @ApiResponse({ status: 404, description: 'Sub-raza no encontrada' })
  getSubBreedImages(
    @Param('breed') breed: string,
    @Param('subBreed') subBreed: string,
    @Query('count') count = 5,
  ) {
    return this.factsService.getSubBreedImages(breed.toLowerCase(), subBreed.toLowerCase(), Number(count));
  }
}
