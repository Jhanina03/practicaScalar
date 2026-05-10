import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from './entities/dog.entity';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(Dog)
    private dogsRepository: Repository<Dog>,
  ) {}

  create(createDogDto: CreateDogDto) {
    const dog = this.dogsRepository.create(createDogDto);
    return this.dogsRepository.save(dog);
  }

  findAll() {
    return this.dogsRepository.find();
  }

  async findOne(id: number) {
    const dog = await this.dogsRepository.findOneBy({ id });
    if (!dog) throw new NotFoundException(`Perro con ID ${id} no existe`);
    return dog;
  }

  async update(id: number, updateDogDto: UpdateDogDto) {
    const dog = await this.findOne(id);
    this.dogsRepository.merge(dog, updateDogDto);
    return this.dogsRepository.save(dog);
  }

  async remove(id: number) {
    const dog = await this.findOne(id);
    return this.dogsRepository.remove(dog);
  }
}
