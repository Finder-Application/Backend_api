import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './Users';

@Entity('accounts', { schema: 'capstone_prod' })
export class Accounts {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'user_name', length: 45 })
  username: string;

  @Column('text', { name: 'password' })
  password: string;

  @Column('varchar', { name: 'uuid', length: 45 })
  uuid: string;

  @OneToMany(() => Users, users => users.account)
  users: Users[];
}
