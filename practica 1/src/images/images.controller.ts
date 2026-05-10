import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { DogImageResponseDto } from './dto/image.dto';

@ApiTags('Imágenes de Perros')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('random')
  @ApiOperation({
    summary: 'Obtener una imagen aleatoria',
    description: 'Retorna una imagen aleatoria de cualquier raza de perro.',
  })
  @ApiResponse({ status: 200, description: 'Imagen aleatoria obtenida', type: DogImageResponseDto })
  getRandom() {
    return this.imagesService.getRandom(1);
  }

  @Get('random/:count')
  @ApiOperation({
    summary: 'Obtener múltiples imágenes aleatorias',
    description: 'Retorna N imágenes aleatorias. Máximo recomendado: 25.',
  })
  @ApiParam({ name: 'count', description: 'Cantidad de imágenes a obtener', example: 5 })
  @ApiResponse({ status: 200, description: 'Lista de imágenes aleatorias', type: [DogImageResponseDto] })
  getMultipleRandom(@Param('count', ParseIntPipe) count: number) {
    return this.imagesService.getRandom(count);
  }

  @Get('breed/:breedId')
  @ApiOperation({
    summary: 'Obtener imágenes por raza',
    description: 'Retorna imágenes de una raza específica usando su ID numérico.',
  })
  @ApiParam({ name: 'breedId', description: 'ID numérico de la raza', example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 5, description: 'Número de imágenes a retornar' })
  @ApiResponse({ status: 200, description: 'Imágenes de la raza obtenidas', type: [DogImageResponseDto] })
  getByBreed(
    @Param('breedId', ParseIntPipe) breedId: number,
    @Query('limit') limit = 5,
  ) {
    return this.imagesService.getByBreed(breedId, Number(limit));
  }

  @Get(':imageId')
  @ApiOperation({
    summary: 'Obtener imagen por ID',
    description: 'Retorna los detalles de una imagen específica usando su ID de cadena.',
  })
  @ApiParam({ name: 'imageId', description: 'ID de cadena de la imagen', example: 'BJa4kxc4X' })
  @ApiResponse({ status: 200, description: 'Imagen encontrada', type: DogImageResponseDto })
  @ApiResponse({ status: 404, description: 'Imagen no encontrada' })
  getById(@Param('imageId') imageId: string) {
    return this.imagesService.getById(imageId);
  }
}
