import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ContentService,
  UpsertContentDto,
  CreateNewsDto,
  UpdateNewsDto,
  CreateCurriculumDto,
  UpdateCurriculumDto,
} from './content.service';

// ─── Site Content ─────────────────────────────────────────────────────────────

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  /** Public: get all key/values for a section */
  @Get(':section')
  getSectionContent(@Param('section') section: string) {
    return this.contentService.getSectionContent(section);
  }

  /** Public: get a single content item */
  @Get(':section/:key')
  getContentItem(
    @Param('section') section: string,
    @Param('key') key: string,
  ) {
    return this.contentService.getContentItem(section, key);
  }

  /** Admin: upsert a single content item */
  @Put(':section/:key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  upsertContent(
    @Param('section') section: string,
    @Param('key') key: string,
    @Body() dto: UpsertContentDto,
  ) {
    return this.contentService.upsertContent(section, key, dto);
  }

  /** Admin: bulk upsert all fields in a section at once */
  @Put(':section')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  bulkUpsertSection(
    @Param('section') section: string,
    @Body() entries: Array<{ key: string } & UpsertContentDto>,
  ) {
    return this.contentService.bulkUpsertSection(section, entries);
  }
}

// ─── News ─────────────────────────────────────────────────────────────────────

@Controller('news')
export class NewsController {
  constructor(private readonly contentService: ContentService) {}

  /** Public: list articles. Pass ?all=true (admin) for drafts too */
  @Get()
  getAllNews(@Query('all') all?: string) {
    const publishedOnly = all !== 'true';
    return this.contentService.getAllNews(publishedOnly);
  }

  /** Public: get article by slug */
  @Get(':slug')
  getNewsBySlug(@Param('slug') slug: string) {
    return this.contentService.getNewsBySlug(slug);
  }

  /** Admin: create article */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  createNews(@Body() dto: CreateNewsDto) {
    return this.contentService.createNews(dto);
  }

  /** Admin: update article */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  updateNews(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    return this.contentService.updateNews(id, dto);
  }

  /** Admin: delete article */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteNews(@Param('id') id: string) {
    return this.contentService.deleteNews(id);
  }
}

// ─── Curricula ────────────────────────────────────────────────────────────────

@Controller('curricula')
export class CurriculaController {
  constructor(private readonly contentService: ContentService) {}

  /** Public: list curricula */
  @Get()
  getAllCurricula(@Query('all') all?: string) {
    const publishedOnly = all !== 'true';
    return this.contentService.getAllCurricula(publishedOnly);
  }

  /** Public: get curriculum by slug */
  @Get(':slug')
  getCurriculumBySlug(@Param('slug') slug: string) {
    return this.contentService.getCurriculumBySlug(slug);
  }

  /** Admin: create curriculum */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  createCurriculum(@Body() dto: CreateCurriculumDto) {
    return this.contentService.createCurriculum(dto);
  }

  /** Admin: update curriculum */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  updateCurriculum(@Param('id') id: string, @Body() dto: UpdateCurriculumDto) {
    return this.contentService.updateCurriculum(id, dto);
  }

  /** Admin: delete curriculum */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCurriculum(@Param('id') id: string) {
    return this.contentService.deleteCurriculum(id);
  }
}
