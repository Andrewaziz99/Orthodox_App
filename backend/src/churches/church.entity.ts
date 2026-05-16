import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('church')
export class Church {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  location: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  address: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  phone: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  email: string | null;

  @Column({
    type: 'enum',
    enum: ['pending', 'active', 'rejected'],
    default: 'pending',
  })
  status: 'pending' | 'active' | 'rejected';

  @Column({ type: 'int', nullable: true, default: null, name: 'max_children' })
  maxChildren: number | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
    name: 'subscription_start_date',
  })
  subscriptionStartDate: Date | null;

  // Referenced by user.entity → @ManyToOne(() => Church, (church) => church.members)
  @OneToMany('User', 'church')
  members: any[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
