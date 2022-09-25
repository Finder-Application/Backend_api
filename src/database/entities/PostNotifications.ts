import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Posts } from "./Posts";
import { Users } from "./Users";

@Index("fk_post_notifications_proflie_id_idx", ["profileId"], {})
@Index("fk_post_notifications_post_id_idx", ["postId"], {})
@Entity("post_notifications", { schema: "capstone_prod" })
export class PostNotifications {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("int", { name: "profile_id" })
  profileId: number;

  @Column("int", { name: "post_id" })
  postId: number;

  @Column("tinyint", { name: "seen", width: 1 })
  seen: boolean;

  @Column("text", { name: "content" })
  content: string;

  @ManyToOne(() => Posts, (posts) => posts.postNotifications, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "post_id", referencedColumnName: "id" }])
  post: Posts;

  @ManyToOne(() => Users, (users) => users.postNotifications, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "profile_id", referencedColumnName: "id" }])
  profile: Users;
}
