/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { EVENT_REDIS, PUSH_NOTIFICATION } from 'constants/event-emit';
import { Session } from 'interfaces/request';
import { AuthService } from 'modules/auth/auth.service';
import { Socket } from 'socket.io';
import { NotificationPostDto } from './dtos/notification.dto';
import { NotificationService } from './notifications.service';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/api/notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.listonEventPushNotification();
  }

  listonEventPushNotification() {
    this.redis.subscribe(EVENT_REDIS.NEW_INFO_POST).catch(() => null);

    this.redis.on('message', (channel, message) => {
      console.info('channel', channel, message);
    });
  }

  @WebSocketServer()
  server: Socket;

  getRoomNotify = (userId: number) => `room-notify-${userId}`;

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token?.toString();

    try {
      const decode = this.authService.validateJwt(token || '') as Session;
      const nameRoom = this.getRoomNotify(decode.userId);
      (client.request as any).session = decode;

      await client.join(nameRoom);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.pushTotalNotification(decode.userId);
      // push total notification for user
      // const count = await this.notificationService.countNotifications(decode.userId);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.info('client out', client.id);
  }

  async pushTotalNotification(userId: number) {
    const nameRoom = this.getRoomNotify(userId);
    const { count } = await this.notificationService.countNotifications(userId);
    this.server.to(nameRoom).emit('take-total-notification', count);
  }

  @OnEvent(PUSH_NOTIFICATION)
  async handlePushNewNotification(payload: NotificationPostDto) {
    // const { content, contents } = payload;
    // const nameRoom = this.getRoomNotify(userId);
    // const dataSendToClient = { contents };
    // await this.server
    //   .to(nameRoom)
    //   .emit('take-notification', JSON.stringify(dataSendToClient));
  }
}

// dumy data for test
// channel NEW_INFO_POST {"id":381,"post_id":71,"seen":false,"content":"Title day ","user_id":1,"title":"Title day "}
// channel NEW_INFO_POST {"id":383,"post_id":71,"seen":false,"content":"Title day ","user_id":1,"title":"Title day "}
// channel NEW_INFO_POST {"id":382,"post_id":71,"seen":false,"content":"Title day ","user_id":1,"title":"Title day "}
// channel NEW_INFO_POST {"id":384,"post_id":62,"seen":false,"content":"","user_id":1,"title":""}
// channel NEW_INFO_POST {"id":385,"post_id":71,"seen":false,"content":"Title day ","user_id":1,"title":"Title day "}
// channel NEW_INFO_POST {"id":386,"post_id":59,"seen":false,"content":"","user_id":1,"title":""}
