import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { MailModule } from 'modules/mail/mail.module';
import { MailService } from 'modules/mail/mail.service';
import { ApiConfigService } from './services/api-config.service';
import { GeneratorService } from './services/generator.service';
import { ValidatorService } from './services/validator.service';

const providers = [
  ApiConfigService,
  ValidatorService,
  GeneratorService,
  MailService,
  // {
  //   provide: 'NATS_SERVICE',
  //   useFactory: (configService: ApiConfigService) => {
  //     const natsConfig = configService.natsConfig;
  //     return ClientProxyFactory.create({
  //       transport: Transport.NATS,
  //       options: {
  //         name: 'NATS_SERVICE',
  //         url: `nats://${natsConfig.host}:${natsConfig.port}`,
  //       },
  //     });
  //   },
  //   inject: [ApiConfigService],
  // },
];

@Global()
@Module({
  providers,
  imports: [
    HttpModule,
    CqrsModule,
    MailModule,
    // MailerModule.forRootAsync({
    //   imports: [SharedModule],
    //   useFactory: (configService: ApiConfigService) => ({
    //     transport: configService.mailConfig,
    //     defaults: {
    //       from: `"Finder" <${process.env.MAIL_USER || ''}>`,
    //     },
    //   }),
    //   inject: [ApiConfigService],
    // }),
  ],
  exports: [...providers, HttpModule, CqrsModule],
})
export class SharedModule {}
