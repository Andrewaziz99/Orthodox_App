import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('curricula')
export class CurriculumPresentation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true, unique: true })
  graphyCurriculumId: string | null = null;

  @Column({ unique: true })
  slug!: string;

  @Column()
  number!: string;

  @Column()
  badge!: string;

  @Column({ type: 'text' })
  titleAr!: string;

  @Column({ type: 'text' })
  titleEn!: string;

  @Column({ type: 'text' })
  durationAr!: string;

  @Column({ type: 'text' })
  durationEn!: string;

  @Column({ type: 'text' })
  audienceAr!: string;

  @Column({ type: 'text' })
  audienceEn!: string;

  @Column({ type: 'text' })
  descriptionAr!: string;

  @Column({ type: 'text' })
  descriptionEn!: string;

  @Column({ type: 'text' })
  ageRangeAr!: string;

  @Column({ type: 'text' })
  ageRangeEn!: string;

  @Column({ type: 'text', nullable: true })
  fullContentAr?: string;

  @Column({ type: 'text', nullable: true })
  fullContentEn?: string;

  /** Controls display order on the curricula page */
  @Column({ default: 0 })
  order: number = 0;

  @Column({ default: true })
  published: boolean = true;

  @Column({ type: 'simple-array', nullable: true })
  relatedSlugs?: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
