import { Module } from '@nestjs/common';
import { UtilController } from './util.controller';

@Module({
  imports: [],
  controllers: [UtilController],
  providers: [],
})
export class UtilModule {}
