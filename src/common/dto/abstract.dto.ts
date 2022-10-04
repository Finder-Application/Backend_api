import type { AbstractEntity } from '../abstract.entity';

export class AbstractDto {
  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {}
}
