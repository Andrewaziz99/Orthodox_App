import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  Headers,
  ParseUUIDPipe,
  ParseArrayPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GraphyAuthGuard } from '../common/auth/graphy-auth.guard';
import { RolesGuard } from '../common/auth/roles.guard';
import { Roles } from '../common/auth/roles.decorator';
import { GraphyApiService } from '../common/auth/graphy-api.service';
import {
  ContentService,
  UpsertContentDto,
  BulkContentEntryDto,
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
  getContentItem(@Param('section') section: string, @Param('key') key: string) {
    return this.contentService.getContentItem(section, key);
  }

  /** Admin: upsert a single content item */
  @Put(':section/:key')
  @UseGuards(GraphyAuthGuard, RolesGuard)
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
  @UseGuards(GraphyAuthGuard, RolesGuard)
  @Roles('super_admin')
  bulkUpsertSection(
    @Param('section') section: string,
    @Body(
      new ParseArrayPipe({
        items: BulkContentEntryDto,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    entries: BulkContentEntryDto[],
  ) {
    return this.contentService.bulkUpsertSection(section, entries);
  }
}

// ─── News ─────────────────────────────────────────────────────────────────────

@Controller('news')
export class NewsController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  getPublishedNews() {
    return this.contentService.getAllNews(true);
  }

  @Get('admin/all')
  @UseGuards(GraphyAuthGuard, RolesGuard)
  @Roles('super_admin')
  getAllNews() {
    return this.contentService.getAllNews(false);
  }

  /** Public: get article by slug */
  @Get(':slug')
  getNewsBySlug(@Param('slug') slug: string) {
    return this.contentService.getPublishedNewsBySlug(slug);
  }

  /** Admin: create article */
  @Post()
  @UseGuards(GraphyAuthGuard, RolesGuard)
  @Roles('super_admin')
  createNews(@Body() dto: CreateNewsDto) {
    return this.contentService.createNews(dto);
  }

  /** Admin: update article */
  @Put(':id')
  @UseGuards(GraphyAuthGuard, RolesGuard)
  @Roles('super_admin')
  updateNews(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNewsDto,
  ) {
    return this.contentService.updateNews(id, dto);
  }

  /** Admin: delete article */
  @Delete(':id')
  @UseGuards(GraphyAuthGuard, RolesGuard)
  @Roles('super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteNews(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentService.deleteNews(id);
  }
}

// ─── Curricula ────────────────────────────────────────────────────────────────

@Controller('curricula')
export class CurriculaController {
  constructor(
    private readonly contentService: ContentService,
    private readonly graphyApi: GraphyApiService,
  ) {}

  @Get()
  getPublishedCurricula() {
    return this.contentService.getAllCurricula(true);
  }

  @Get('admin/all')
  @UseGuards(GraphyAuthGuard, RolesGuard)
  @Roles('super_admin')
  getAllCurricula() {
    return this.contentService.getAllCurricula(false);
  }

  /** Public: get curriculum by slug */
  @Get(':slug')
  getCurriculumBySlug(@Param('slug') slug: string) {
    return this.contentService.getPublishedCurriculumBySlug(slug);
  }

  /** Admin: create curriculum */
  @Post()
  @UseGuards(GraphyAuthGuard, RolesGuard)
  @Roles('super_admin')
  async createCurriculum(
    @Body() dto: CreateCurriculumDto,
    @Headers('authorization') authorization: string,
  ) {
    await this.graphyApi.assertCurriculumExists(
      dto.graphyCurriculumId,
      authorization,
    );
    return this.contentService.createCurriculum(dto);
  }

  /** Admin: update curriculum */
  @Put(':id')
  @UseGuards(GraphyAuthGuard, RolesGuard)
  @Roles('super_admin')
  async updateCurriculum(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCurriculumDto,
    @Headers('authorization') authorization: string,
  ) {
    await this.graphyApi.assertCurriculumExists(
      dto.graphyCurriculumId,
      authorization,
    );
    return this.contentService.updateCurriculum(id, dto);
  }

  /** Admin: delete curriculum */
  @Delete(':id')
  @UseGuards(GraphyAuthGuard, RolesGuard)
  @Roles('super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCurriculum(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentService.deleteCurriculum(id);
  }
}
