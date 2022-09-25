import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Posts } from "./Posts";

@Index("fk_relevant_network_posts_post_id_idx", ["postId"], {})
@Entity("relevant_network_posts", { schema: "capstone_prod" })
export class RelevantNetworkPosts {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "post_id" })
  postId: number;

  @Column("varchar", { name: "link", nullable: true, length: 200 })
  link: string | null;

  @Column("varchar", { name: "title", nullable: true, length: 200 })
  title: string | null;

  @Column("time", { name: "date" })
  date: string;

  @ManyToOne(() => Posts, (posts) => posts.relevantNetworkPosts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "post_id", referencedColumnName: "id" }])
  post: Posts;
}
