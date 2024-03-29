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
      // eslint-disable-next-line max-len
      privateKey: `-----BEGIN RSA PRIVATE KEY-----\n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\n-----END RSA PRIVATE KEY-----`,
      publicKey:
        // eslint-disable-next-line max-len
        '-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEApTE/AvX8imGvywdYY8SA\nt3oQYNxp8wFGiOlCRKTTlEOmMem3gIjW1Lbube9Uuyo5yB5z0VX64xor8ZAZVnRs\nElvjxWA8mo+oya/Xq7cAxvTWTIb4yhhwro0uUD0XwXo0Q6wB/j/Za4gz/j7aTsKb\nyGwmuScei54rVgivC0cAyb29936jYlXgUfIlO07I2pQhuMYUmVa87CeJvnrLlXpl\nltKSpZyqxRljbij96FwENZ0pLAl4a/l2LCrg4zvEcXPZ4a5VflXhDrB08ULrCAzW\nKWE14Av27rxBQAEaruGhyg5keSKwGUT5OBkbbSMCqVlUxuix+paE0nvF5xuE7Evj\ndjzF96eu/yj5NJ1LlxY8UfBpB3XB9xoCZXEZh1jxtSMs/unNo9+G73ihP/J45tfZ\nIGmd9Cb894slD8p7wl4zrsbqkN5kJY7nNvCzXfw+cvQd88FBMZn2h/tTJE6Fz7P2\nyzw2G5Q1wD0VPC+XiCw8LGkkxzim0xYC20XTr7bd05Czvsh3ErjxbwKji5wQ/Pin\nA9d2L0llGgZxJ4wOHUWYMgJZn/vlxdlijlbp0CUaGDyF3UI0QmLk8G5hbio1KlH2\nY6YN0p1MsI+FruvVI/yOpBfXWCnhe1OhgCokBjE84ikfHfAIw31kS+RHtpW3Sm1d\ndD8wmk/2hbCTdbVvqCjz200CAwEAAQ==\n-----END PUBLIC KEY-----',
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
      privateKey:
        // eslint-disable-next-line max-len
        '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDSz2nGOaJJRVhJ\nPz1HE8ZJguRG9Le4rnhwUH5UaAZhGgOgHCkipNkRCyq14iTix2nXuOxpyWvz69Uy\nigloovTlFZasTHof9gWCRVNnLQB4nYJRxqW73n2L8Nx97XW9a9fxTOjjJRtOpdG0\nC9w/Txf2Dqpiyrx2QF1BRZNvhO+YLarrI/Sk9lBRzbuODZ1eVm/nlh/buOCZrRjS\nXCxZiuGm4hLe3ZVvppCFNx/+NLZj+wwua53Qt7vHPSwJw126eNoI5y0xyjTimc2W\nzWj/K5mQjmQ2a70G3fFe9T4bXsHwZT4paMX/TZNJ6zO8e+dG1zAiiPZG7bxhA4n9\nT9DW6jppAgMBAAECggEAGIyUmuPCizGO/c2mXUj3W/9pBb3RCMnRhvPKuFnaV1O0\nFSC+ZhVIHWjdXwuwI7QY9mkHp+yPvJqrq8xhGt0yM1zDnHo19ROdcd2QoDjgf4tJ\nHiyJx5JZ8LJafPQqlEXTInukObJsJwkene7NJda4ObxcuW82SfeGHJglepTCoYgG\nrf5dIo8ORPcoxWWrcywkjyYpJNIYEJzjqTgl/BSWhuv+hIaiiI8zOsmdtqCQ29XA\nDpckP/P1KFmSjQ9vR3va9OhPDubVYa+0oORRqRbemrq5AS/nqqsCFn/E7+gjEu58\n+D5EDxiTekEKYT8MZ+ktbmEvuzEfU1qDn1XJen0L4QKBgQD4zQowQjgscI5yoczG\n2zbSGzW7B4MM2zDkMYqOQ3PVYUk+CWnbC82mrAYJCwg0IIp6IqsQNgeLh5O6KKAm\nnAlucjBrRVZs6aWljf63p2+4LLg8IDP3H+NzGd0v2EEtsNbMt6vvJRZARGC48g+L\n8cjwArKqu0JVtq9mXD7IUmPTIQKBgQDY6PZJTfXXO3GmohlSBlamPMG6M7i/RXp7\nQkMGiY+ppBe0EtxnIfbVPqUnh21IKCPY9URjhU5AEAFuzkYkyTAwQytFqKXNQ2el\nApdNX52Z1Hb5IhDiXZ23QYOIA9u87QZRhRWZDqpPHYYhmwqPSL4Nn2dDJrVb0r3N\nVcodrbhGSQKBgBTDH4+JZyCmP+zm/ay2jGuaI7C43sHK5NiWHcbjcB4lYTRRGslR\nwdaf0l0c05FuCcBJdlcC+zw0kypcy4iNSugxlULOZXjvQoh/QftXeKY47SLvWQbN\nXXC0ftXISSAj+rjYtvtc7+9rBVtJr+xwv+DviLNgrxdyCE8VcZPL9FKhAoGADovY\n8GONCAkRfxZB0nFgYDeU2lLboeAb7aYs7oRNIRhDCq11IGlzrytLUhJP7tXaSZNx\nKadn7v3jyrWEmLTxSVtHzJ0ZuWE60yMQWH0ACa/o5p41OakDiaWYF4gCtXHDybW+\nFAyauUGGnDxUgfVj4W/+Mc+nu+evGNUW/9SFlhkCgYEAiVBDJ91pmSpc+clFZ7Fa\njS2sfENlXFxF0h1XF0EBTMT0qtHZNZ5eBmEFs/tJ1MS1rNQ0zW656iXZjmC36m85\nqjcgbAH2ol2GQz3Q+RQ8RauDL/7ysB24NJ4KWPqI8a6RzxZxPOjbUb8FgRfGngcG\nC0Nkn/2pzelKPdnRR6d2ezU=\n-----END PRIVATE KEY-----\n',
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
