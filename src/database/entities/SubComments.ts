import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comments } from "./Comments";
import { Users } from "./Users";

@Index("fk_sub_comment_id_idx", ["subFor"], {})
@Index("fk_sub_comment_user_id_idx", ["userId"], {})
@Entity("sub_comments", { schema: "capstone_prod" })
export class SubComments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "sub_for" })
  subFor: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("varchar", { name: "photo", nullable: true, length: 200 })
  photo: string | null;

  @Column("text", { name: "content" })
  content: string;

  @Column("int", { name: "likes", default: () => "'0'" })
  likes: number;

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

  @ManyToOne(() => Users, (users) => users.subComments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @ManyToOne(() => Comments, (comments) => comments.subComments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "sub_for", referencedColumnName: "id" }])
  subFor2: Comments;
}
