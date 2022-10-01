import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'common/dto/page.dto';
import { ApiPageOkResponse } from 'decorators';
import { PostPageOptionsDto } from 'modules/post/dtos/post-page-options.dto';
import { CountNotificationDto, NotificationDto } from './dtos/notification.dto';
import { NotificationService } from './notifications.service';

@Controller('/private/notification')
@ApiTags('Notification')
export class NotificationController {
  constructor(private notiService: NotificationService) {}

  @Get('count-noti')
  @ApiOkResponse({
    type: CountNotificationDto,
    description: 'Count noti',
  })
  getNotifications(): Promise<CountNotificationDto> {
    return this.notiService.countNotifications(1);
  }

  @Get()
  @ApiPageOkResponse({ type: NotificationDto })
  getPaginationNotifications(
    @Query(new ValidationPipe({ transform: true }))
    postsPageOptionsDto: PostPageOptionsDto,
  ): Promise<PageDto<NotificationDto>> {
    return this.notiService.getPostNotifications(1, postsPageOptionsDto);
  }
}
