import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BreedResponseDto {
  @ApiProperty({ example: 1, description: 'ID único de la raza' })
  id: number;

  @ApiProperty({ example: 'Labrador Retriever', description: 'Nombre de la raza' })
  name: string;

  @ApiPropertyOptional({ example: 'Friendly, Active, Outgoing', description: 'Temperamento' })
  temperament?: string;

  @ApiPropertyOptional({ example: 'Canada', description: 'País de origen' })
  origin?: string;

  @ApiPropertyOptional({ example: '10 - 12 years', description: 'Esperanza de vida' })
  life_span?: string;

  @ApiPropertyOptional({ example: 3, description: 'Nivel de inteligencia (1-5)' })
  intelligence?: number;

  @ApiPropertyOptional({ example: 5, description: 'Nivel de energía (1-5)' })
  energy_level?: number;
}

export class BreedSearchQueryDto {
  @ApiPropertyOptional({ example: 'labrador', description: 'Nombre de la raza a buscar' })
  q?: string;

  @ApiPropertyOptional({ example: 10, description: 'Límite de resultados', default: 10 })
  limit?: number;

  @ApiPropertyOptional({ example: 0, description: 'Página de resultados', default: 0 })
  page?: number;
}
