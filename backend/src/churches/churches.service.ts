import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Church } from './church.entity';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import type { CreateChurchDto } from './dto/create-church.dto';
import type { UpdateChurchDto } from './dto/update-church.dto';
import type { ListChurchesQueryDto } from './dto/list-churches-query.dto';
import type { BulkUpdateChurchStatusDto } from './dto/bulk-update-church-status.dto';
import type { PaginatedResponse } from '../common/pagination';

@Injectable()
export class ChurchesService {
  constructor(
    @InjectRepository(Church)
    private readonly churchRepo: Repository<Church>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(
    query: ListChurchesQueryDto = {},
  ): Promise<PaginatedResponse<Church>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const qb = this.churchRepo.createQueryBuilder('church');

    if (query.search?.trim()) {
      qb.andWhere(
        "(church.name ILIKE :search OR COALESCE(church.email, '') ILIKE :search OR COALESCE(church.phone, '') ILIKE :search OR COALESCE(church.location, '') ILIKE :search OR COALESCE(church.address, '') ILIKE :search)",
        { search: `%${query.search.trim()}%` },
      );
    }

    if (query.status) {
      qb.andWhere('church.status = :status', { status: query.status });
    }

    qb.orderBy('church.name', 'ASC').skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<Church> {
    const c = await this.churchRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Church not found');
    return c;
  }

  async create(payload: CreateChurchDto): Promise<Church> {
    const entity = this.churchRepo.create({
      name: payload.name,
      maxChildren: payload.maxChildren ?? 0,
      status: 'pending',
    });

    if (payload.location) entity.location = payload.location;
    if (payload.address) entity.address = payload.address;
    if (payload.phone) entity.phone = payload.phone;
    if (payload.email) entity.email = payload.email;

    const saved = await this.churchRepo.save(entity);

    // If admin details provided, create a church_admin user and link
    if (payload.admin) {
      const adminPayload = payload.admin;
      const password =
        adminPayload.password ?? Math.random().toString(36).slice(-8);
      const hash = await bcrypt.hash(password, 10);

      const user = this.userRepo.create({
        name: adminPayload.name,
        email: adminPayload.email,
        phone: adminPayload.phone,
        passwordHash: hash,
        role: 'church_admin',
        church: saved,
        churchId: saved.id,
        status: 'active',
      } as Partial<User>);

      await this.userRepo.save(user);
    }

    return saved;
  }

  async update(id: string, payload: UpdateChurchDto): Promise<Church> {
    const church = await this.findOne(id);
    Object.assign(church, payload);
    return this.churchRepo.save(church);
  }

  async remove(id: string): Promise<void> {
    await this.churchRepo.delete(id);
  }

  async bulkRemove(ids: string[]): Promise<{ deleted: number }> {
    const result = await this.churchRepo.delete(ids);
    return { deleted: result.affected ?? 0 };
  }

  async bulkUpdateStatus(
    ids: string[],
    payload: BulkUpdateChurchStatusDto,
  ): Promise<{ updated: number }> {
    const result = await this.churchRepo.update(ids, {
      status: payload.status,
    });
    return { updated: result.affected ?? 0 };
  }
}
