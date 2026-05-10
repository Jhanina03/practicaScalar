import { Injectable } from '@nestjs/common';

@Injectable()
export class FactsService {
  async getRandomImage() {
    return { message: 'https://images.dog.ceo/breeds/poodle-standard/n02113799_2280.jpg', status: 'success' };
  }

  async getRandomImages(count = 1) {
    return { 
      message: Array(count).fill('https://images.dog.ceo/breeds/poodle-standard/n02113799_2280.jpg'),
      status: 'success' 
    };
  }

  async getAllBreeds() {
    return {
      message: {
        "african": [],
        "airedale": [],
        "akita": [],
        "appenzeller": [],
        "australian": ["shepherd"]
      },
      status: "success",
      count: 5
    };
  }

  async getBreedImages(breed: string, count = 5) {
    return {
      message: Array(count).fill('https://images.dog.ceo/breeds/poodle-standard/n02113799_2280.jpg'),
      status: 'success'
    };
  }

  async getSubBreedImages(breed: string, subBreed: string, count = 5) {
    return {
      message: Array(count).fill('https://images.dog.ceo/breeds/poodle-standard/n02113799_2280.jpg'),
      status: 'success'
    };
  }
}
