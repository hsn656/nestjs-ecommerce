import { BadRequestException } from '@nestjs/common';
import { TypeHelpOptions } from 'class-transformer';
import { Categories } from 'src/database/entities/category.entity';
import { ComputerDetails } from './computer.details';
import { TestDetails } from './test.details';

export type ProductDetails = ComputerDetails | TestDetails;

export function ProductDetailsTypeFn(options: TypeHelpOptions) {
  switch (options.object?.details?.category) {
    case Categories.Computers:
      return ComputerDetails;
    case 'Test':
      return TestDetails;
  }

  throw new BadRequestException('invalid details.category input');
}
