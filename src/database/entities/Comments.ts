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
import { SubComments } from "./SubComments";
import { Users } from "./Users";

@Index("fk_comment_profile_id_idx", ["userId"], {})
@Index("fk_comment_post_id_idx", ["postId"], {})
@Entity("comments", { schema: "capstone_prod" })
export class Comments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

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
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @OneToMany(() => SubComments, (subComments) => subComments.subFor2)
  subComments: SubComments[];
}
