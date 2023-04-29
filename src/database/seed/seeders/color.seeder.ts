import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Color,
  Colors,
  ColorsHexCodes,
} from 'src/database/entities/color.entity';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';

@Injectable()
export class ColorSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Color)
    private readonly colorsRepository: Repository<Color>,
  ) {}

  async seed() {
    const data: Partial<Color>[] = this.generateData();
    await this.colorsRepository.upsert(data, {
      conflictPaths: ['name'],
    });
  }

  generateData(): Partial<Color>[] {
    const data: Partial<Color>[] = [];
    Object.keys(Colors).forEach((key) => {
      data.push({
        name: Colors[key],
        hexCode: ColorsHexCodes[key],
      });
    });
    return data;
  }
}
