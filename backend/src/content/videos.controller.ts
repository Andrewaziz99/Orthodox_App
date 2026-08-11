import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto, UpdateVideoDto } from './video.dto';
import { GraphyAuthGuard } from '../common/auth/graphy-auth.guard';
import { RolesGuard } from '../common/auth/roles.guard';
import { Roles } from '../common/auth/roles.decorator';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.videosService.findOne(id);
  }

  @Post()
  @UseGuards(GraphyAuthGuard, RolesGuard)
  @Roles('super_admin')
  create(@Body() videoFields: CreateVideoDto) {
    return this.videosService.create(videoFields);
  }

  @Put(':id')
  @UseGuards(GraphyAuthGuard, RolesGuard)
  @Roles('super_admin')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() videoFields: UpdateVideoDto,
  ) {
    return this.videosService.update(id, videoFields);
  }

  @Delete(':id')
  @UseGuards(GraphyAuthGuard, RolesGuard)
  @Roles('super_admin')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.videosService.remove(id);
  }
}
