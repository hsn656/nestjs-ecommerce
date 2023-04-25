import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Categories,
  Category,
  CategoryIds,
} from 'src/database/entities/category.entity';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';

@Injectable()
export class CategorySeeder implements SeederInterface {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async seed() {
    const data: Partial<Category>[] = this.generateData();
    await this.categoriesRepository.upsert(data, {
      conflictPaths: ['id'],
    });
  }

  generateData(): Partial<Category>[] {
    const data: Partial<Category>[] = [];
    Object.keys(Categories).forEach((key) => {
      data.push({
        id: CategoryIds[key],
        name: Categories[key],
      });
    });
    return data;
  }
}
