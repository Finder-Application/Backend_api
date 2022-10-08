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

@Index("fk_sub_comment_id_idx", ["subFor"], {})
@Index("fk_sub_comment_user_id_idx", ["userId"], {})
@Index("fk_sub_comment_post_id_idx", ["postId"], {})
@Entity("sub_comments", { schema: "capstone_prod" })
export class SubComments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "sub_for" })
  subFor: number;

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

  @ManyToOne(() => Comments, (comments) => comments.subComments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "sub_for", referencedColumnName: "id" }])
  subFor2: Comments;

  @ManyToOne(() => Posts, (posts) => posts.subComments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "post_id", referencedColumnName: "id" }])
  post: Posts;

  @ManyToOne(() => Users, (users) => users.subComments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}