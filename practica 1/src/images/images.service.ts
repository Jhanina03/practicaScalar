import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ImagesService {
  private readonly mockImages = [
    { id: '1', url: 'https://cdn2.thedogapi.com/images/BJa4kxc4X.jpg', width: 1600, height: 1199 },
    { id: '2', url: 'https://cdn2.thedogapi.com/images/hMyT4CDDe.jpg', width: 1080, height: 1080 },
    { id: '3', url: 'https://cdn2.thedogapi.com/images/rjXByec4X.jpg', width: 1500, height: 1125 },
  ];

  async getRandom(count = 1) {
    return count === 1 ? this.mockImages[0] : this.mockImages.slice(0, count);
  }

  async getByBreed(breedId: number, limit = 5) {
    return this.mockImages.slice(0, limit);
  }

  async getById(imageId: string) {
    const img = this.mockImages.find(i => i.id === imageId);
    if (!img) {
      throw new HttpException(`Imagen ${imageId} no encontrada`, HttpStatus.NOT_FOUND);
    }
    return img;
  }
}
