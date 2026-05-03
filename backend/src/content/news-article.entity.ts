import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('news_articles')
export class NewsArticle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'text' })
  titleAr!: string;

  @Column({ type: 'text' })
  titleEn!: string;

  @Column({ type: 'text' })
  excerptAr!: string;

  @Column({ type: 'text' })
  excerptEn!: string;

  @Column({ type: 'text' })
  bodyAr!: string;

  @Column({ type: 'text' })
  bodyEn!: string;

  @Column({ type: 'text' })
  categoryAr!: string;

  @Column({ type: 'text' })
  categoryEn!: string;

  @Column()
  date!: string;

  @Column({ nullable: true })
  author?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ default: false })
  published: boolean = false;

  /** Controls display order on the news page */
  @Column({ default: 0 })
  order: number = 0;

  @Column({ type: 'simple-array', nullable: true })
  relatedSlugs?: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
