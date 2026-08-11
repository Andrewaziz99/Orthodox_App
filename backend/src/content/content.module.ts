import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { CmsAuthModule } from '../common/auth/cms-auth.module';
import { SiteContent } from './site-content.entity';
import { NewsArticle } from './news-article.entity';
import { CurriculumPresentation } from './curriculum-presentation.entity';
import { Video } from './video.entity';
import { ContentService } from './content.service';
import { VideosService } from './videos.service';
import {
  ContentController,
  NewsController,
  CurriculaController,
} from './content.controller';
import { UploadController } from './upload.controller';
import { VideosController } from './videos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SiteContent,
      NewsArticle,
      CurriculumPresentation,
      Video,
    ]),
    MulterModule.register(),
    CmsAuthModule,
  ],
  providers: [ContentService, VideosService],
  controllers: [
    ContentController,
    NewsController,
    CurriculaController,
    UploadController,
    VideosController,
  ],
  exports: [ContentService, VideosService],
})
export class ContentModule {}
