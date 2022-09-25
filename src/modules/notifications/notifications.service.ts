import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  //TODO: count all notification
  //   async countNotifications(profile_id: number): Promise<number> {
  //     const [notifyComments, notifyPosts] = await this.prisma.$transaction([
  //       prisma.user.count(),
  //       prisma.user.findMany({
  //         take: 5,
  //         cursor: {
  //           id: 5,
  //         },
  //       }),
  //     ]);
  //     this.prisma.comments.count({
  //       where: {
  //         profile_id: profile_id,
  //         comment_notifications: {},
  //       },
  //     });
  //     return 1;
  //   }
  //   //TODO: pagination get notification
  //   async getNotifications(profile_id: number): Promise<number> {
  //     this.prisma.comments.count({
  //       where: {
  //         profile_id: profile_id,
  //         comment_notifications: {},
  //       },
  //     });
  //     return 1;
  //   }
}
