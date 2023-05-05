import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Accounts } from 'database/entities/Accounts';
import { CommentNotifications } from 'database/entities/CommentNotifications';
import { Comments } from 'database/entities/Comments';
import { PostNotifications } from 'database/entities/PostNotifications';
import { Posts } from 'database/entities/Posts';
import { RelevantNetworkPosts } from 'database/entities/RelevantNetworkPosts';
import { SubComments } from 'database/entities/SubComments';
import { Users } from 'database/entities/Users';
import { isNil } from 'lodash';
import { SnakeNamingStrategy } from '../../snake-naming.strategy';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE');
  }

  get postgresConfig(): TypeOrmModuleOptions {
    return {
      keepConnectionAlive: !this.isTest,
      type: 'mysql',
      name: 'default',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      entities: [
        Accounts,
        Comments,
        CommentNotifications,
        PostNotifications,
        Users,
        SubComments,
        RelevantNetworkPosts,
        Posts,
      ],
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: false,
    };
  }

  get redisConfig(): string {
    const host = this.getString('REDIS_HOST');
    const port = this.getNumber('REDIS_PORT');
    const user = this.getString('REDIS_USER');
    const password = this.getString('REDIS_PW');
    const db = this.getNumber('REDIS_DB');

    return `redis://${user}:${password}@${host}:${port}?db=${db}`;
  }

  get mailConfig(): {
    apiKey: string;
    domain: string;
  } {
    const apiKey = this.getString('MAIL_API_KEY');
    const domain = this.getString('MAIL_DOMAIN');

    return {
      apiKey,
      domain,
    };
  }

  get configHashPassword(): string {
    return this.getString('HASH_PASSWORD');
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get natsEnabled(): boolean {
    return this.getBoolean('NATS_ENABLED');
  }

  get natsConfig() {
    return {
      host: this.getString('NATS_HOST'),
      port: this.getNumber('NATS_PORT'),
    };
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  get configGoogle() {
    return {
      clientId: this.getString('GOOGLE_CLIENT_ID'),
      clientSecret: this.getString('GOOGLE_CLIENT_SECRET'),
    };
  }

  get apiUrlFaceApi(): string {
    return this.get('FACE_API_URL');
  }

  get firebaseConfig() {
    return {
      projectId: this.get('FIREBASE_PROJECT_ID'),
      privateKey: this.get('FIREBASE_PRIVATE_KEY'),
      clientEmail: this.get('FIREBASE_CLIENT_EMAIL'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);
    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
