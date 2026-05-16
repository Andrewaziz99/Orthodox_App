import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Church } from './church.entity';
import { CreateChurchDto, UpdateChurchDto } from './dto/church.dto';

@Injectable()
export class ChurchesService {
  constructor(
    @InjectRepository(Church)
    private readonly churchesRepo: Repository<Church>,
  ) {}

  async create(dto: CreateChurchDto): Promise<Church> {
    const church = this.churchesRepo.create({
      name:        dto.name,
      location:    dto.location    ?? null,
      address:     dto.address     ?? null,
      phone:       dto.phone       ?? null,
      email:       dto.email       ?? null,
      maxChildren: dto.maxChildren ?? null,
      status:      'pending',
    });
    return this.churchesRepo.save(church);
  }

  async findAll(query?: {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ data: Church[]; total: number }> {
    const page  = Math.max(1, query?.page  ?? 1);
    const limit = Math.min(100, query?.limit ?? 50);
    const skip  = (page - 1) * limit;

    const where: FindManyOptions<Church>['where'] = {};
    if (query?.search) where['name']   = Like(`%${query.search}%`);
    if (query?.status) where['status'] = query.status as any;

    const [data, total] = await this.churchesRepo.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async findOne(id: string): Promise<Church> {
    const church = await this.churchesRepo.findOne({ where: { id } });
    if (!church) throw new NotFoundException(`Church ${id} not found`);
    return church;
  }

  async update(id: string, dto: UpdateChurchDto): Promise<Church> {
    const church = await this.findOne(id);

    if (dto.name        !== undefined) church.name        = dto.name;
    if (dto.location    !== undefined) church.location    = dto.location    ?? null;
    if (dto.address     !== undefined) church.address     = dto.address     ?? null;
    if (dto.phone       !== undefined) church.phone       = dto.phone       ?? null;
    if (dto.email       !== undefined) church.email       = dto.email       ?? null;
    if (dto.maxChildren !== undefined) church.maxChildren = dto.maxChildren ?? null;
    if (dto.status      !== undefined) church.status      = dto.status;

    return this.churchesRepo.save(church);
  }

  async remove(id: string): Promise<void> {
    const church = await this.findOne(id);
    await this.churchesRepo.remove(church);
  }
}
