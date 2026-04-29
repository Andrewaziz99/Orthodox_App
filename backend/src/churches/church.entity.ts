import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Church {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ default: 'pending' })
  status: string = 'pending';

  @Column({ default: 0 })
  maxChildren: number = 0;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  subscriptionStartDate?: Date;

  @OneToMany(() => User, (user) => user.church)
  members!: User[];
}
