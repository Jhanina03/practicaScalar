import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDogDto {
  @ApiProperty({ example: 'Rex', description: 'Nombre del perro' })
  name: string;

  @ApiProperty({ example: 'Labrador', description: 'Raza del perro' })
  breed: string;

  @ApiPropertyOptional({ example: 3, description: 'Edad del perro' })
  age?: number;
}
