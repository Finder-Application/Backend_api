import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'common/dto/page.dto';
import { ApiPageOkResponse, GetSession } from 'decorators';
import { Session } from 'interfaces/request';
import { PostPageOptionsDto } from 'modules/post/dtos/post-page-options.dto';
import { InstallFCM, PushMessages } from './dtos/installFCM.dto';
import {
  CountNotificationDto,
  NotificationCmtDto,
  NotificationPostDto,
} from './dtos/notification.dto';
import { NotificationService } from './notifications.service';

@Controller('/private/notification')
@ApiBearerAuth()
@ApiTags('Notification')
export class NotificationController {
  constructor(private notiService: NotificationService) {}

  @Get('count-noti')
  @ApiOkResponse({
    type: CountNotificationDto,
    description: 'Count noti',
  })
  getNotifications(
    @GetSession() session: Session,
  ): Promise<CountNotificationDto> {
    console.info(session);
    return this.notiService.countNotifications(1);
  }

  @Get('/comments')
  @ApiPageOkResponse({ type: NotificationCmtDto })
  getPaginationCmtNotifications(
    @GetSession() session: Session,
    @Query(new ValidationPipe({ transform: true }))
    postsPageOptionsDto: PostPageOptionsDto,
  ): Promise<PageDto<NotificationCmtDto>> {
    return this.notiService.getCmtNotifications(
      session.userId,
      postsPageOptionsDto,
    );
  }

  @Get('/posts')
  @ApiPageOkResponse({ type: NotificationPostDto })
  getPaginationPostNotifications(
    @GetSession() session: Session,

    @Query(new ValidationPipe({ transform: true }))
    postsPageOptionsDto: PostPageOptionsDto,
  ): Promise<PageDto<NotificationPostDto>> {
    return this.notiService.getPostNotifications(
      session.userId,
      postsPageOptionsDto,
    );
  }

  @Post('/install-fcm')
  installFCM(@Body() installFCM: InstallFCM, @GetSession() session: Session) {
    return this.notiService.installFCM(session.userId, installFCM.token);
  }

  @Get('/push-notification')
  pushNotification(
    @GetSession() session: Session,
    @Query() message: PushMessages,
  ) {
    return this.notiService.pushNotification(
      session.userId,
      message.title,
      message.body,
    );
  }
}
