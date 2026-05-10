import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class BreedsService {
  private readonly mockBreeds = [
    { id: 1, name: 'Affenpinscher', temperament: 'Stubborn, Curious, Playful', life_span: '10 - 12 years' },
    { id: 2, name: 'Afghan Hound', temperament: 'Aloof, Clownish, Dignified', life_span: '10 - 13 years' },
    { id: 3, name: 'African Hunting Dog', temperament: 'Wild, Hardworking, Dutiful', life_span: '11 years' },
    { id: 4, name: 'Airedale Terrier', temperament: 'Outgoing, Friendly, Alert', life_span: '10 - 13 years' },
    { id: 5, name: 'Akbash Dog', temperament: 'Loyal, Independent, Intelligent', life_span: '13 - 15 years' },
  ];

  async findAll(limit = 10, page = 0) {
    return this.mockBreeds.slice(page * limit, (page + 1) * limit);
  }

  async findOne(id: number) {
    const breed = this.mockBreeds.find(b => b.id === id);
    if (!breed) {
      throw new HttpException(`Raza con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
    }
    return breed;
  }

  async search(name: string) {
    return this.mockBreeds.filter(b => b.name.toLowerCase().includes(name.toLowerCase()));
  }
}
