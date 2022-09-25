/* eslint-disable @typescript-eslint/no-unused-vars */
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PUSH_NOTIFICATION } from 'constants/event-emit';

import { Socket } from 'socket.io';
import { NotificationDto } from './dtos/notification.dto';

@UsePipes(new ValidationPipe())
@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Socket;

  // constructor
  //   constructor() {}

  // helper
  getRoomNotify = (userId: number) => `room-notify-${userId}`;

  handleConnection(client: Socket) {
    const token = client.handshake.query.token?.toString();
    // const payload = this.authService.verifyAccessToken(token);
    // TODO: do it when oke auth
    const fakePayload = 1;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (fakePayload) {
      const nameRoom = this.getRoomNotify(1);
      client.join(nameRoom);
    }
  }

  handleDisconnect(client: Socket) {
    // this.connectedUsers.delete(client.id);
    console.info('client out', client.id);
  }

  @OnEvent(PUSH_NOTIFICATION)
  handlePushNewNotification(payload: NotificationDto) {
    const { userId, contents } = payload;
    const nameRoom = this.getRoomNotify(userId);
    const dataSendToClient = { contents };

    this.server
      .to(nameRoom)
      .emit('take-notification', JSON.stringify(dataSendToClient));
  }
}
