import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteContent, ContentType } from './site-content.entity';
import { NewsArticle } from './news-article.entity';
import { Curriculum } from './curriculum.entity';

// ─── DTOs ────────────────────────────────────────────────────────────────────

export class UpsertContentDto {
  valueAr?: string;
  valueEn?: string;
  type?: ContentType;
}

export class CreateNewsDto {
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  bodyAr: string;
  bodyEn: string;
  categoryAr: string;
  categoryEn: string;
  date: string;
  author?: string;
  image?: string;
  published?: boolean;
  order?: number;
  relatedSlugs?: string[];
}

export class UpdateNewsDto extends CreateNewsDto {}

export class CreateCurriculumDto {
  slug: string;
  number: string;
  badge: string;
  titleAr: string;
  titleEn: string;
  durationAr: string;
  durationEn: string;
  audienceAr: string;
  audienceEn: string;
  descriptionAr: string;
  descriptionEn: string;
  ageRangeAr: string;
  ageRangeEn: string;
  fullContentAr?: string;
  fullContentEn?: string;
  order?: number;
  published?: boolean;
  relatedSlugs?: string[];
}

export class UpdateCurriculumDto extends CreateCurriculumDto {}

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(SiteContent)
    private readonly siteContentRepo: Repository<SiteContent>,
    @InjectRepository(NewsArticle)
    private readonly newsRepo: Repository<NewsArticle>,
    @InjectRepository(Curriculum)
    private readonly curriculaRepo: Repository<Curriculum>,
  ) {}

  // ── Site Content ────────────────────────────────────────────────────────────

  async getSectionContent(section: string): Promise<SiteContent[]> {
    return this.siteContentRepo.find({ where: { section } });
  }

  async getContentItem(section: string, key: string): Promise<SiteContent> {
    const item = await this.siteContentRepo.findOne({ where: { section, key } });
    if (!item) throw new NotFoundException(`Content not found: ${section}/${key}`);
    return item;
  }

  async upsertContent(
    section: string,
    key: string,
    dto: UpsertContentDto,
  ): Promise<SiteContent> {
    let item = await this.siteContentRepo.findOne({ where: { section, key } });
    if (!item) {
      item = this.siteContentRepo.create({ section, key });
    }
    Object.assign(item, dto);
    return this.siteContentRepo.save(item);
  }

  async bulkUpsertSection(
    section: string,
    entries: Array<{ key: string } & UpsertContentDto>,
  ): Promise<SiteContent[]> {
    return Promise.all(
      entries.map(({ key, ...dto }) => this.upsertContent(section, key, dto)),
    );
  }

  // ── News ────────────────────────────────────────────────────────────────────

  async getAllNews(publishedOnly = false): Promise<NewsArticle[]> {
    const where = publishedOnly ? { published: true } : {};
    return this.newsRepo.find({ where, order: { order: 'ASC', createdAt: 'DESC' } });
  }

  async getNewsBySlug(slug: string): Promise<NewsArticle> {
    const article = await this.newsRepo.findOne({ where: { slug } });
    if (!article) throw new NotFoundException(`News article not found: ${slug}`);
    return article;
  }

  async getNewsById(id: string): Promise<NewsArticle> {
    const article = await this.newsRepo.findOne({ where: { id } });
    if (!article) throw new NotFoundException(`News article not found: ${id}`);
    return article;
  }

  async createNews(dto: CreateNewsDto): Promise<NewsArticle> {
    const article = this.newsRepo.create(dto);
    return this.newsRepo.save(article);
  }

  async updateNews(id: string, dto: UpdateNewsDto): Promise<NewsArticle> {
    const article = await this.getNewsById(id);
    Object.assign(article, dto);
    return this.newsRepo.save(article);
  }

  async deleteNews(id: string): Promise<void> {
    const article = await this.getNewsById(id);
    await this.newsRepo.remove(article);
  }

  // ── Curricula ───────────────────────────────────────────────────────────────

  async getAllCurricula(publishedOnly = false): Promise<Curriculum[]> {
    const where = publishedOnly ? { published: true } : {};
    return this.curriculaRepo.find({ where, order: { order: 'ASC' } });
  }

  async getCurriculumBySlug(slug: string): Promise<Curriculum> {
    const curriculum = await this.curriculaRepo.findOne({ where: { slug } });
    if (!curriculum) throw new NotFoundException(`Curriculum not found: ${slug}`);
    return curriculum;
  }

  async getCurriculumById(id: string): Promise<Curriculum> {
    const curriculum = await this.curriculaRepo.findOne({ where: { id } });
    if (!curriculum) throw new NotFoundException(`Curriculum not found: ${id}`);
    return curriculum;
  }

  async createCurriculum(dto: CreateCurriculumDto): Promise<Curriculum> {
    const curriculum = this.curriculaRepo.create(dto);
    return this.curriculaRepo.save(curriculum);
  }

  async updateCurriculum(id: string, dto: UpdateCurriculumDto): Promise<Curriculum> {
    const curriculum = await this.getCurriculumById(id);
    Object.assign(curriculum, dto);
    return this.curriculaRepo.save(curriculum);
  }

  async deleteCurriculum(id: string): Promise<void> {
    const curriculum = await this.getCurriculumById(id);
    await this.curriculaRepo.remove(curriculum);
  }
}
