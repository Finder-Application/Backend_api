import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Posts } from "./Posts";
import { Users } from "./Users";

@Index("fk_post_notifications_proflie_id_idx", ["userId"], {})
@Index("fk_post_notifications_post_id_idx", ["postId"], {})
@Entity("post_notifications", { schema: "capstone_prod" })
export class PostNotifications {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("int", { name: "post_id" })
  postId: number;

  @Column("tinyint", { name: "seen", width: 1 })
  seen: boolean;

  @Column("text", { name: "content" })
  content: string;

  @Column("varchar", { name: "title", length: 200 })
  title: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @ManyToOne(() => Users, (users) => users.postNotifications, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @ManyToOne(() => Posts, (posts) => posts.postNotifications, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "post_id", referencedColumnName: "id" }])
  post: Posts;
}
