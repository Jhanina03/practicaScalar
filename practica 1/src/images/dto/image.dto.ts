import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DogImageResponseDto {
  @ApiProperty({ example: 'abc123xyz', description: 'ID único de la imagen' })
  id: string;

  @ApiProperty({ example: 'https://cdn2.thedogapi.com/images/abc123.jpg', description: 'URL de la imagen' })
  url: string;

  @ApiPropertyOptional({ example: 800, description: 'Ancho en píxeles' })
  width?: number;

  @ApiPropertyOptional({ example: 600, description: 'Alto en píxeles' })
  height?: number;
}
