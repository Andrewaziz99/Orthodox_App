import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { SiteContent, ContentType } from './site-content.entity';
import { NewsArticle } from './news-article.entity';
import { CurriculumPresentation } from './curriculum-presentation.entity';

// ─── DTOs ────────────────────────────────────────────────────────────────────

export class UpsertContentDto {
  @IsString()
  @IsOptional()
  valueAr?: string;

  @IsString()
  @IsOptional()
  valueEn?: string;

  @IsEnum(ContentType)
  @IsOptional()
  type?: ContentType;
}

export class BulkContentEntryDto extends UpsertContentDto {
  @IsString()
  key!: string;
}

export class CreateNewsDto {
  @IsString()
  slug: string;

  @IsString()
  titleAr: string;

  @IsString()
  titleEn: string;

  @IsString()
  excerptAr: string;

  @IsString()
  excerptEn: string;

  @IsString()
  bodyAr: string;

  @IsString()
  bodyEn: string;

  @IsString()
  categoryAr: string;

  @IsString()
  categoryEn: string;

  @IsString()
  date: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  relatedSlugs?: string[];
}

export class UpdateNewsDto extends CreateNewsDto {}

class CurriculumPresentationDto {
  @IsString()
  slug: string;

  @IsString()
  number: string;

  @IsString()
  badge: string;

  @IsString()
  titleAr: string;

  @IsString()
  titleEn: string;

  @IsString()
  durationAr: string;

  @IsString()
  durationEn: string;

  @IsString()
  audienceAr: string;

  @IsString()
  audienceEn: string;

  @IsString()
  descriptionAr: string;

  @IsString()
  descriptionEn: string;

  @IsString()
  ageRangeAr: string;

  @IsString()
  ageRangeEn: string;

  @IsString()
  @IsOptional()
  fullContentAr?: string;

  @IsString()
  @IsOptional()
  fullContentEn?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  relatedSlugs?: string[];
}

export class CreateCurriculumDto extends CurriculumPresentationDto {
  @IsUUID()
  graphyCurriculumId!: string;
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
    @InjectRepository(CurriculumPresentation)
    private readonly curriculaRepo: Repository<CurriculumPresentation>,
  ) {}

  private validateJsonContent(item: SiteContent): void {
    if (item.type !== ContentType.JSON) return;

    for (const [locale, serializedValue] of [['Arabic', item.valueAr], ['English', item.valueEn]] as const) {
      if (serializedValue === null || serializedValue === undefined) continue;
      try {
        JSON.parse(serializedValue);
      } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
        throw new BadRequestException(`${locale} value must contain valid JSON.`);
      }
    }
  }

  private async saveContent(
    repository: Repository<SiteContent>,
    section: string,
    key: string,
    dto: UpsertContentDto,
  ): Promise<SiteContent> {
    const existing = await repository.findOne({ where: { section, key } });
    const item = Object.assign(existing ?? repository.create({ section, key }), dto);
    this.validateJsonContent(item);
    return repository.save(item);
  }

  // ── Site Content ────────────────────────────────────────────────────────────

  async getSectionContent(section: string): Promise<SiteContent[]> {
    return this.siteContentRepo.find({ where: { section } });
  }

  async getContentItem(section: string, key: string): Promise<SiteContent> {
    const item = await this.siteContentRepo.findOne({
      where: { section, key },
    });
    if (!item)
      throw new NotFoundException(`Content not found: ${section}/${key}`);
    return item;
  }

  async upsertContent(
    section: string,
    key: string,
    dto: UpsertContentDto,
  ): Promise<SiteContent> {
    return this.saveContent(this.siteContentRepo, section, key, dto);
  }

  async bulkUpsertSection(
    section: string,
    entries: Array<{ key: string } & UpsertContentDto>,
  ): Promise<SiteContent[]> {
    return this.siteContentRepo.manager.transaction(async (manager) => {
      const repository = manager.getRepository(SiteContent);
      return Promise.all(
        entries.map(({ key, ...dto }) => this.saveContent(repository, section, key, dto)),
      );
    });
  }

  // ── News ────────────────────────────────────────────────────────────────────

  async getAllNews(publishedOnly = false): Promise<NewsArticle[]> {
    const where = publishedOnly ? { published: true } : {};
    return this.newsRepo.find({
      where,
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async getPublishedNewsBySlug(slug: string): Promise<NewsArticle> {
    const article = await this.newsRepo.findOne({
      where: { slug, published: true },
    });
    if (!article)
      throw new NotFoundException(`News article not found: ${slug}`);
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

  async getAllCurricula(
    publishedOnly = false,
  ): Promise<CurriculumPresentation[]> {
    const where = publishedOnly
      ? { published: true, graphyCurriculumId: Not(IsNull()) }
      : {};
    return this.curriculaRepo.find({ where, order: { order: 'ASC' } });
  }

  async getPublishedCurriculumBySlug(
    slug: string,
  ): Promise<CurriculumPresentation> {
    const curriculum = await this.curriculaRepo.findOne({
      where: { slug, published: true, graphyCurriculumId: Not(IsNull()) },
    });
    if (!curriculum)
      throw new NotFoundException(`Curriculum not found: ${slug}`);
    return curriculum;
  }

  async getCurriculumById(id: string): Promise<CurriculumPresentation> {
    const curriculum = await this.curriculaRepo.findOne({ where: { id } });
    if (!curriculum) throw new NotFoundException(`Curriculum not found: ${id}`);
    return curriculum;
  }

  async createCurriculum(
    dto: CreateCurriculumDto,
  ): Promise<CurriculumPresentation> {
    const curriculum = this.curriculaRepo.create(dto);
    return this.curriculaRepo.save(curriculum);
  }

  async updateCurriculum(
    id: string,
    dto: UpdateCurriculumDto,
  ): Promise<CurriculumPresentation> {
    const curriculum = await this.getCurriculumById(id);
    Object.assign(curriculum, dto);
    return this.curriculaRepo.save(curriculum);
  }

  async deleteCurriculum(id: string): Promise<void> {
    const curriculum = await this.getCurriculumById(id);
    await this.curriculaRepo.remove(curriculum);
  }
}
