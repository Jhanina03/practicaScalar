import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const DOG_API_BASE = 'https://api.thedogapi.com/v1';

@Injectable()
export class ImagesService {
  constructor(private readonly httpService: HttpService) {}

  async getRandom(count = 1) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${DOG_API_BASE}/images/search`, {
          params: { limit: count },
        }),
      );
      return count === 1 ? data[0] : data;
    } catch {
      throw new HttpException('Error al obtener imágenes', HttpStatus.BAD_GATEWAY);
    }
  }

  async getByBreed(breedId: number, limit = 5) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${DOG_API_BASE}/images/search`, {
          params: { breed_ids: breedId, limit },
        }),
      );
      return data;
    } catch {
      throw new HttpException('Error al obtener imágenes de la raza', HttpStatus.BAD_GATEWAY);
    }
  }

  async getById(imageId: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${DOG_API_BASE}/images/${imageId}`),
      );
      return data;
    } catch {
      throw new HttpException(`Imagen ${imageId} no encontrada`, HttpStatus.NOT_FOUND);
    }
  }
}
