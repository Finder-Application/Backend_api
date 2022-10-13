import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsEnum, IsString, validate, ValidationError } from 'class-validator';
import { NumberFieldOptional, StringFieldOptional } from '../../decorators';

export enum EFilter {
  IsNull = 'ISNULL',
  ILike = 'ILIKE',
  Like = 'LIKE',
  Equal = 'EQUAL',
  MoreThanOrEqual = 'MORETHANOREQUAL',
  MoreThan = 'MORETHAN',
  LessThanOrEqual = 'LESSTHANOREQUAL',
  LessThan = 'LESSTHAN',
  Not = 'NOT',
}

export class CFilter implements Filter {
  @IsString()
  name: string;
  @IsEnum(EFilter)
  operator: string;
  @IsString()
  value: string;
}

export const validateFilter = async (value: string) => {
  if (!value) {
    return [];
  }

  let newValue: CFilter[] = [];

  try {
    newValue = JSON.parse(value) as CFilter[];
  } catch (error) {
    throw new BadRequestException(error.message);
  }

  if (Array.isArray(newValue)) {
    const filters = plainToClass(CFilter, newValue);

    let listErrors: ValidationError[] = [];
    for (const e of filters) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises, no-await-in-loop
      const errors = await validate(e);

      if (errors.length > 0) {
        listErrors = [...listErrors, ...errors];
        break;
      }
    }
    if (listErrors.length > 0) {
      throw new BadRequestException({
        message: listErrors,
      });
    }

    return filters;
  }
};
export class PageOptionsDto {
  //   @EnumFieldOptional(() => Order, {
  //     default: Order.ASC,
  //   })
  //   readonly order: Order = Order.ASC;

  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  readonly page: number = 1;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    int: true,
  })
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  //   @StringFieldOptional()
  //   readonly q?: string;

  @StringFieldOptional()
  readonly order?: string;

  @StringFieldOptional()
  readonly filter?: string;
}
