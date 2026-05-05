import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

export enum ContentType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  IMAGE = 'image',
  JSON = 'json',
}

@Entity('site_content')
@Unique(['section', 'key'])
export class SiteContent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** e.g. "hero", "about", "cta", "vision" */
  @Column()
  section!: string;

  /** e.g. "heading", "subtitle", "badge" */
  @Column()
  key!: string;

  @Column({ type: 'text', nullable: true })
  valueAr?: string;

  @Column({ type: 'text', nullable: true })
  valueEn?: string;

  /** Determines the input type used in the admin form */
  @Column({
    type: 'enum',
    enum: ContentType,
    default: ContentType.TEXT,
  })
  type: ContentType = ContentType.TEXT;

  @UpdateDateColumn()
  updatedAt!: Date;
}
