import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { CommentNotifications } from "./CommentNotifications";
import { Comments } from "./Comments";
import { PostNotifications } from "./PostNotifications";
import { RelevantNetworkPosts } from "./RelevantNetworkPosts";
import { Users } from "./Users";

@Index("fk_posts_profile_id_idx", ["profileId"], {})
@Entity("posts", { schema: "capstone_prod" })
export class Posts {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("int", { name: "profile_id" })
  profileId: number;

  @Column("varchar", { name: "first_name", length: 45 })
  firstName: string;

  @Column("varchar", { name: "lats_name", length: 45 })
  latsName: string;

  @Column("time", { name: "date_of_birth", nullable: true })
  dateOfBirth: string | null;

  @Column("tinyblob", { name: "gender" })
  gender: Buffer;

  @Column("varchar", { name: "lost_address", nullable: true, length: 200 })
  lostAddress: string | null;

  @Column("varchar", { name: "hometown", nullable: true, length: 200 })
  hometown: string | null;

  @Column("time", { name: "lost_time", nullable: true })
  lostTime: string | null;

  @Column("varchar", { name: "relationship", nullable: true, length: 45 })
  relationship: string | null;

  @Column("varchar", { name: "photos", nullable: true, length: 500 })
  photos: string | null;

  @Column("varchar", { name: "relevant_posts", nullable: true, length: 45 })
  relevantPosts: string | null;

  @Column("int", { name: "share_count", nullable: true, default: () => "'1'" })
  shareCount: number | null;

  @OneToMany(
    () => CommentNotifications,
    (commentNotifications) => commentNotifications.post
  )
  commentNotifications: CommentNotifications[];

  @OneToMany(() => Comments, (comments) => comments.post)
  comments: Comments[];

  @OneToMany(
    () => PostNotifications,
    (postNotifications) => postNotifications.post
  )
  postNotifications: PostNotifications[];

  @ManyToOne(() => Users, (users) => users.posts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "profile_id", referencedColumnName: "id" }])
  profile: Users;

  @OneToMany(
    () => RelevantNetworkPosts,
    (relevantNetworkPosts) => relevantNetworkPosts.post
  )
  relevantNetworkPosts: RelevantNetworkPosts[];
}
