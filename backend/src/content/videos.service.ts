import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './video.entity';
import { CreateVideoDto, UpdateVideoDto } from './video.dto';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videoRepo: Repository<Video>,
  ) {}

  findAll() {
    return this.videoRepo.find({ order: { order: 'ASC' } });
  }

  async findOne(id: string) {
    const video = await this.videoRepo.findOne({ where: { id } });
    if (!video) throw new NotFoundException('Video not found');
    return video;
  }

  async create(videoFields: CreateVideoDto) {
    const count = await this.videoRepo.count();
    if (count >= 6) {
      throw new BadRequestException('Maximum of 6 videos reached');
    }
    const video = this.videoRepo.create(videoFields);
    return this.videoRepo.save(video);
  }

  async update(id: string, videoFields: UpdateVideoDto) {
    const video = await this.findOne(id);
    Object.assign(video, videoFields);
    return this.videoRepo.save(video);
  }

  async remove(id: string) {
    const video = await this.findOne(id);
    return this.videoRepo.remove(video);
  }
}
