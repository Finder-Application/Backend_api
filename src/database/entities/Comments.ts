import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CommentNotifications } from "./CommentNotifications";
import { Posts } from "./Posts";
import { Users } from "./Users";

@Index("fk_comment_profile_id_idx", ["profileId"], {})
@Index("fb_comment_post_id_idx", ["postId"], {})
@Entity("comments", { schema: "capstone_prod" })
export class Comments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "rep_for" })
  repFor: number;

  @Column("int", { name: "post_id" })
  postId: number;

  @Column("int", { name: "profile_id" })
  profileId: number;

  @Column("varchar", { name: "photos", nullable: true, length: 200 })
  photos: string | null;

  @Column("text", { name: "content" })
  content: string;

  @OneToMany(
    () => CommentNotifications,
    (commentNotifications) => commentNotifications.comment
  )
  commentNotifications: CommentNotifications[];

  @ManyToOne(() => Posts, (posts) => posts.comments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "post_id", referencedColumnName: "id" }])
  post: Posts;

  @ManyToOne(() => Users, (users) => users.comments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "profile_id", referencedColumnName: "id" }])
  profile: Users;
}
