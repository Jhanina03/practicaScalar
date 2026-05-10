import { ApiProperty } from '@nestjs/swagger';

export class DogFactResponseDto {
  @ApiProperty({ example: 'Dogs have a sense of time and miss their owners.', description: 'Dato curioso sobre perros' })
  fact: string;

  @ApiProperty({ example: 1, description: 'Número de datos curiosos solicitados' })
  count: number;
}

export class DogBreedListResponseDto {
  @ApiProperty({
    example: { affenpinscher: [], afghan_hound: [] },
    description: 'Objeto con razas y sus sub-razas',
  })
  message: Record<string, string[]>;

  @ApiProperty({ example: 'success', description: 'Estado de la respuesta' })
  status: string;
}

export class DogBreedImageResponseDto {
  @ApiProperty({
    example: ['https://images.dog.ceo/breeds/labrador/n02099712_100.jpg'],
    description: 'Lista de URLs de imágenes de la raza',
  })
  message: string[];

  @ApiProperty({ example: 'success' })
  status: string;
}
