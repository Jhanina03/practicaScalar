import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const DOG_CEO_BASE = 'https://dog.ceo/api';

@Injectable()
export class FactsService {
  constructor(private readonly httpService: HttpService) {}

  async getRandomImage() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${DOG_CEO_BASE}/breeds/image/random`),
      );
      return { url: data.message, status: data.status };
    } catch {
      throw new HttpException('Error al obtener imagen aleatoria', HttpStatus.BAD_GATEWAY);
    }
  }

  async getRandomImages(count: number) {
    const safe = Math.min(count, 50);
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${DOG_CEO_BASE}/breeds/image/random/${safe}`),
      );
      return { urls: data.message, count: data.message.length, status: data.status };
    } catch {
      throw new HttpException('Error al obtener imágenes', HttpStatus.BAD_GATEWAY);
    }
  }

  async getAllBreeds() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${DOG_CEO_BASE}/breeds/list/all`),
      );
      const breeds = Object.keys(data.message);
      return {
        total: breeds.length,
        breeds: breeds,
        withSubBreeds: Object.entries(data.message as Record<string, string[]>)
          .filter(([, subs]) => subs.length > 0)
          .map(([breed, subs]) => ({ breed, subBreeds: subs })),
      };
    } catch {
      throw new HttpException('Error al obtener razas', HttpStatus.BAD_GATEWAY);
    }
  }

  async getBreedImages(breed: string, count = 5) {
    const safe = Math.min(count, 50);
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${DOG_CEO_BASE}/breed/${breed}/images/random/${safe}`),
      );
      return { breed, images: data.message, count: data.message.length };
    } catch {
      throw new HttpException(`Raza '${breed}' no encontrada`, HttpStatus.NOT_FOUND);
    }
  }

  async getSubBreedImages(breed: string, subBreed: string, count = 5) {
    const safe = Math.min(count, 50);
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${DOG_CEO_BASE}/breed/${breed}/${subBreed}/images/random/${safe}`),
      );
      return { breed, subBreed, images: data.message, count: data.message.length };
    } catch {
      throw new HttpException(`Sub-raza '${breed}/${subBreed}' no encontrada`, HttpStatus.NOT_FOUND);
    }
  }


}
