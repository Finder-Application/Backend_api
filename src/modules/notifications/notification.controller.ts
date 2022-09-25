import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('/private/notification')
@ApiTags('Notification')
export class NotificationController {
  @Get()
  getNotifications() {
    return 'getNotifications by pagination';
  }
}
