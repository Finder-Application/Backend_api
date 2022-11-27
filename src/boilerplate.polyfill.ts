/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable @typescript-eslint/naming-convention,sonarjs/cognitive-complexity */
import { BadRequestException } from '@nestjs/common';
import 'source-map-support/register';

import type { ObjectLiteral } from 'typeorm';
import { Brackets, QueryBuilder, SelectQueryBuilder } from 'typeorm';

import type { AbstractEntity } from './common/abstract.entity';
import type { AbstractDto } from './common/dto/abstract.dto';
import { PageMetaDto } from './common/dto/page-meta.dto';
import {
  CFilter,
  PageOptionsDto,
  validateFilter,
} from './common/dto/page-options.dto';
import { PageDto } from './common/dto/page.dto';
import type { KeyOfType } from './types';

declare global {
  export type Uuid = string & { _uuidBrand: undefined };

  interface Filter {
    field: string;
    operator: string;
    value: string;
  }
  interface Array<T> {
    toPageDto<Dto extends AbstractDto>(
      this: T[],
      pageMetaDto: PageMetaDto,
      // FIXME make option type visible from entity
      options?: unknown,
    ): PageDto<Dto>;
  }
}

declare module 'typeorm' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface QueryBuilder<Entity> {
    searchByString(q: string, columnNames: string[]): this;
  }

  interface SelectQueryBuilder<Entity> {
    paginate(
      this: SelectQueryBuilder<Entity>,
      pageOptionsDto: PageOptionsDto,
      mapDto?: (e: Entity) => unknown,
      nameTable?: string,
      options?: Partial<{ takeAll: boolean }>,
    ): Promise<[Entity[], PageMetaDto]>;

    leftJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    leftJoin<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    innerJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    innerJoin<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;
  }
}

Array.prototype.toPageDto = function (pageMetaDto: PageMetaDto) {
  return new PageDto(this, pageMetaDto);
};

QueryBuilder.prototype.searchByString = function (q, columnNames) {
  if (!q) {
    return this;
  }

  this.andWhere(
    new Brackets(qb => {
      for (const item of columnNames) {
        qb.orWhere(`${item} LIKE :q`);
      }
    }),
  );

  this.setParameter('q', `%${q}%`);

  return this;
};

SelectQueryBuilder.prototype.paginate = async function (
  pageOptionsDto: PageOptionsDto,
  mapDto: <T>(e) => T,
  nameTable: string,
  options?: Partial<{ takeAll: boolean }>,
) {
  if (!options?.takeAll) {
    this.skip(pageOptionsDto.skip).take(pageOptionsDto.take);
  }

  const { order, filter } = pageOptionsDto;

  if (order) {
    const field = order.split(':')[0];
    const sortBy = order.split(':')[1].toUpperCase() as 'ASC' | 'DESC';
    const nulls = String(order.split(':')[2])
      .replace('_', ' ')
      .toUpperCase() as 'NULLS FIRST' | 'NULLS LAST';
    if (['ASC', 'DESC'].includes(sortBy)) {
      if (['NULLS FIRST', 'NULLS LAST'].includes(nulls)) {
        this.orderBy(`${nameTable}.${field}`, sortBy, nulls);
      }
      this.orderBy(`${nameTable}.${field}`, sortBy);
    }
  }

  if (filter) {
    const error = await validateFilter(filter);

    if (error) {
      throw new BadRequestException(error);
    }
    const newFilter = JSON.parse(filter) as CFilter[];
    newFilter.forEach(e => {
      let operatorSQL = e.operator;
      switch (e.operator) {
        case 'EQUAL': {
          operatorSQL = '=';
          break;
        }
        case 'MoreThanOrEqual': {
          operatorSQL = '>=';
          break;
        }
        case 'MoreThan': {
          operatorSQL = '>';
          break;
        }
        case 'LessThan': {
          operatorSQL = '<';
          break;
        }
        case 'LessThanOrEqual': {
          operatorSQL = '<=';
          break;
        }
        default: {
          break;
        }
      }
      this.orWhere(`${nameTable}.${e.field} ${operatorSQL} (:value)`, {
        value: e.value,
      });
    });
  }

  const itemCount = await this.getCount();

  const { entities } = await this.getRawAndEntities();

  const newEntities = entities.map(e => mapDto(e));

  const pageMetaDto = new PageMetaDto({
    itemCount,
    pageOptionsDto,
  });

  return [newEntities, pageMetaDto];
};
