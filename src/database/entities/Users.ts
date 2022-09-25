import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Accounts } from './Accounts';
import { Comments } from './Comments';
import { PostNotifications } from './PostNotifications';
import { Posts } from './Posts';

@Index('fk_profile_user_id_idx', ['accountId'], {})
@Entity('users', { schema: 'capstone_prod' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'account_id' })
  accountId: number;

  @Column('varchar', { name: 'first_name', length: 45 })
  firstName: string;

  @Column('varchar', { name: 'middle_name', nullable: true, length: 45 })
  middleName: string | null;

  @Column('varchar', { name: 'last_name', length: 45 })
  lastName: string;

  @Column('tinyint', { name: 'is_active', width: 1, default: () => "'1'" })
  isActive: boolean;

  @Column('varchar', {
    name: 'avatar',
    nullable: true,
    length: 300,
    default: () =>
      "'https://www.google.com/url?sa=i&url=https%3A%2F%2Fdepositphotos.com%2Fvector-images%2Fdefault-avatar.html&psig=AOvVaw0gCWmrWc0Yn7yLpBzu3Xee&ust=1664164161678000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCKjT8OKEr_oCFQAAAAAdAAAAABAD'",
  })
  avatar: string | null;

  @Column('varchar', { name: 'social', nullable: true, length: 200 })
  social: string | null;

  @Column('varchar', { name: 'phone', nullable: true, length: 50 })
  phone: string | null;

  @Column('varchar', { name: 'address', nullable: true, length: 200 })
  address: string | null;

  @Column('varchar', { name: 'email', nullable: true, length: 50 })
  email: string | null;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Comments, comments => comments.profile)
  comments: Comments[];

  @OneToMany(
    () => PostNotifications,
    postNotifications => postNotifications.profile,
  )
  postNotifications: PostNotifications[];

  @OneToMany(() => Posts, posts => posts.profile)
  posts: Posts[];

  @ManyToOne(() => Accounts, accounts => accounts.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }])
  account: Accounts;
}
