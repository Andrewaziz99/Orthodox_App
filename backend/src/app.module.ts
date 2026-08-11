import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentModule } from './content/content.module';
import { CurriculumPresentation } from './content/curriculum-presentation.entity';
import { NewsArticle } from './content/news-article.entity';
import { SiteContent } from './content/site-content.entity';
import { Video } from './content/video.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASS'),
        database: config.get('DATABASE_NAME'),
        entities: [SiteContent, NewsArticle, CurriculumPresentation, Video],
        synchronize: false,
      }),
    }),
    ContentModule,
  ],
})
export class AppModule {}
