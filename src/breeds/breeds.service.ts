import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const DOG_API_BASE = 'https://api.thedogapi.com/v1';

@Injectable()
export class BreedsService {
  constructor(private readonly httpService: HttpService) { }

  async findAll(limit = 10, page = 0) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${DOG_API_BASE}/breeds`, {
          params: { limit, page },
        }),
      );
      return data;
    } catch {
      throw new HttpException('Error al obtener razas', HttpStatus.BAD_GATEWAY);
    }
  }

  async findOne(id: number) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${DOG_API_BASE}/breeds/${id}`),
      );
      return data;
    } catch {
      throw new HttpException(`Raza con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
    }
  }

  async search(name: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${DOG_API_BASE}/breeds/search`, {
          params: { q: name },
        }),
      );
      return data;
    } catch {
      throw new HttpException('Error en la búsqueda', HttpStatus.BAD_GATEWAY);
    }
  }
}
