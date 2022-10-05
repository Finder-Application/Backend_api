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

@Index("fk_comment_profile_id_idx", ["userId"], {})
@Index("fb_comment_post_id_idx", ["postId"], {})
@Index("fk_rep_for_idx", ["repFor"], {})
@Entity("comments", { schema: "capstone_prod" })
export class Comments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "rep_for", nullable: true })
  repFor: number | null;

  @Column("int", { name: "post_id" })
  postId: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("varchar", { name: "photo", nullable: true, length: 200 })
  photo: string | null;

  @Column("text", { name: "content" })
  content: string;

  @Column("int", { name: "likes", default: () => "'0'" })
  likes: number;

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
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @ManyToOne(() => Comments, (comments) => comments.comments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "rep_for", referencedColumnName: "id" }])
  repFor2: Comments;

  @OneToMany(() => Comments, (comments) => comments.repFor2)
  comments: Comments[];
}
