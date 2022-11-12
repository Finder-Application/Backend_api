import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentNotifications } from './CommentNotifications';
import { Comments } from './Comments';
import { PostNotifications } from './PostNotifications';
import { RelevantNetworkPosts } from './RelevantNetworkPosts';
import { Users } from './Users';

@Index('fk_posts_profile_id_idx', ['userId'], {})
@Entity('posts', { schema: 'capstone_prod' })
export class Posts {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('varchar', { name: 'title', nullable: true, length: 200 })
  title: string | null;

  @Column('varchar', { name: 'full_name', length: 100 })
  fullName: string | null;

  @Column('varchar', { name: 'nickname', length: 100 })
  nickname: string | null;

  @Column('date', { name: 'date_of_birth', nullable: true })
  dateOfBirth: string | null;

  @Column('tinyint', { name: 'gender', nullable: true, width: 1 })
  gender: boolean | null;

  @Column('varchar', { name: 'hometown_region', nullable: true, length: 200 })
  hometownRegion: string | null;

  @Column('varchar', { name: 'hometown_state', nullable: true, length: 100 })
  hometownState: string | null;

  @Column('varchar', { name: 'hometown_commune', nullable: true, length: 100 })
  hometownCommune: string | null;

  @Column('varchar', { name: 'hometown_hamlet', nullable: true, length: 100 })
  hometownHamlet: string | null;

  @Column('varchar', { name: 'relevant_posts', nullable: true, length: 45 })
  relevantPosts: string | null;

  @Column('varchar', { name: 'missing_region', nullable: true, length: 200 })
  missingRegion: string | null;

  @Column('varchar', { name: 'missing_state', nullable: true, length: 100 })
  missingState: string | null;

  @Column('varchar', { name: 'missing_hamlet', nullable: true, length: 100 })
  missingHamlet: string | null;

  @Column('varchar', { name: 'missing_commune', nullable: true, length: 100 })
  missingCommune: string | null;

  @Column('datetime', { name: 'missing_time', nullable: true })
  missingTime: string | null;

  @Column('varchar', { name: 'photos', length: 2000 })
  photos: string | null;

  @Column('varchar', { name: 'relationship', nullable: true, length: 45 })
  relationship: string | null;

  @Column('varchar', { name: 'description', nullable: true, length: 500 })
  description: string | null;

  @Column('int', { name: 'share_count', nullable: true, default: () => "'0'" })
  shareCount: number | null;

  @Column('datetime', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(
    () => CommentNotifications,
    commentNotifications => commentNotifications.post,
  )
  commentNotifications: CommentNotifications[];

  @OneToMany(() => Comments, comments => comments.post)
  comments: Comments[];

  @OneToMany(
    () => PostNotifications,
    postNotifications => postNotifications.post,
  )
  postNotifications: PostNotifications[];

  @ManyToOne(() => Users, users => users.posts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;

  @OneToMany(
    () => RelevantNetworkPosts,
    relevantNetworkPosts => relevantNetworkPosts.post,
  )
  relevantNetworkPosts: RelevantNetworkPosts[];
}
