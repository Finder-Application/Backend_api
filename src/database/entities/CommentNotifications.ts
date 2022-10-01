import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comments } from "./Comments";
import { Posts } from "./Posts";
import { Users } from "./Users";

@Index("fk_c_post_id_idx", ["postId"], {})
@Index("fk_c_notification_comment_id_idx", ["commentId"], {})
@Index("fk_c_user_id_idx", ["userId"], {})
@Entity("comment_notifications", { schema: "capstone_prod" })
export class CommentNotifications {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "post_id" })
  postId: number;

  @Column("int", { name: "comment_id" })
  commentId: number;

  @Column("tinyint", { name: "seen", width: 1 })
  seen: boolean;

  @Column("text", { name: "content" })
  content: string;

  @Column("varchar", {
    name: "comment_notificationscol",
    nullable: true,
    length: 45,
  })
  commentNotificationscol: string | null;

  @Column("int", { name: "user_id" })
  userId: number;

  @ManyToOne(() => Comments, (comments) => comments.commentNotifications, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "comment_id", referencedColumnName: "id" }])
  comment: Comments;

  @ManyToOne(() => Posts, (posts) => posts.commentNotifications, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "post_id", referencedColumnName: "id" }])
  post: Posts;

  @ManyToOne(() => Users, (users) => users.commentNotifications, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
