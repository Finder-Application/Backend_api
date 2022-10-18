import { Module } from '@nestjs/common';
import { ApiConfigService } from 'shared/services/api-config.service';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [],
  providers: [FirebaseService, ApiConfigService],
  controllers: [],
  exports: [FirebaseService],
})
export class FirebaseModule {}
