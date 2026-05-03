import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  titleAr!: string;

  @Column()
  titleEn!: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  /** Can be a YouTube URL or a Cloudinary video URL */
  @Column()
  videoUrl!: string;

  @Column({ default: true })
  isYoutube!: boolean;

  @Column({ default: 0 })
  order!: number;

  @UpdateDateColumn()
  updatedAt!: Date;
}
