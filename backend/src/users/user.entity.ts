import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Church } from '../churches/church.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true, nullable: true })
  phone?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({
    type: 'enum',
    enum: ['super_admin', 'church_admin', 'servant', 'child'],
  })
  role!: string;

  @Column({ nullable: true })
  passwordHash?: string;

  @Column({ default: 'pending' })
  status: string = 'pending';

  @ManyToOne(() => Church, (church) => church.members, { nullable: true })
  church?: Church;

  @Column({ nullable: true })
  churchId?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
