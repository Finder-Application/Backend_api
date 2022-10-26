import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { IsEnum, IsString, validate, ValidationError } from 'class-validator';
import { NumberFieldOptional, StringFieldOptional } from '../../decorators';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
export class OrderDto {
  @IsString()
  field: string;
  @IsEnum(Order)
  value: Order;
}

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
  field: string;
  @IsEnum(EFilter)
  operator: string;
  @IsString()
  value: string;
}

export const validateFilter = async (value: string) => {
  if (!value) {
    return null;
  }

  let newValue: CFilter[] = [];

  try {
    newValue = JSON.parse(value) as CFilter[];

    if (!Array.isArray(newValue)) {
      return 'Filter must be an array';
    }
  } catch (error) {
    return error.message;
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
      return listErrors;
    }

    return null;
  }
};
export class PageOptionsDto {
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

  @StringFieldOptional()
  @ApiProperty({
    description: `
    # How to use order
    
    order?: string;

    ## Example order : 'content:ASC'
    
    *Explanation:*
    | Name        | Description                                                                |
    | ----------- | ---------------------------------------------------------------------------|
    | field       | 'content' -> 'content' field of table   |
    | operator    | ASC|DESC                                                                   |

    ------------------------
    `,
  })
  readonly order?: string;

  @StringFieldOptional({})
  @ApiProperty({
    description: `
    # How to use filter

    enum Operator {
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

    class Filter {
        field: string;
        operator: Operator;
        value: string;
    }

    filter?: string as Filter[];

    ## Example filter : [{"field":"content","operator":"LIKE","value":"cin"}]
    (This example when in api get comments pagination , you can reused for the other api pagination , as long as your field correct with table of api)
    
    *Explanation:*
    | Name        | Description                                                                |
    | ----------- | ---------------------------------------------------------------------------|
    | field       | 'content' 'content' field of table   |
    | operator    | is enum of Operator                                                        |
    | value       | Value you want filter                                                      |

    ------------------------
    `,
  })
  readonly filter?: string;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
