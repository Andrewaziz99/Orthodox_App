import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { Church } from '../churches/church.entity';
import type { ListUsersQueryDto } from './dto/list-users-query.dto';
import type { BulkUpdateUserStatusDto } from './dto/bulk-update-user-status.dto';
import type { PaginatedResponse } from '../common/pagination';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Church)
    private readonly churchRepo: Repository<Church>,
  ) {}

  async findAll(query: ListUsersQueryDto = {}): Promise<PaginatedResponse<User>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const qb = this.userRepo.createQueryBuilder('user');

    if (query.search?.trim()) {
      qb.andWhere(
        '(user.name ILIKE :search OR COALESCE(user.email, \'\') ILIKE :search OR COALESCE(user.phone, \'\') ILIKE :search)',
        { search: `%${query.search.trim()}%` },
      );
    }

    if (query.role) {
      qb.andWhere('user.role = :role', { role: query.role });
    }

    if (query.status) {
      qb.andWhere('user.status = :status', { status: query.status });
    }

    if (query.churchId) {
      qb.andWhere('user.churchId = :churchId', { churchId: query.churchId });
    }

    qb.orderBy('user.createdAt', 'DESC').skip(skip).take(limit);

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

  async findOne(id: string): Promise<User> {
    const u = await this.userRepo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async create(dto: CreateUserDto): Promise<User> {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('email or phone required');
    }

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      role: dto.role,
      status: 'active',
    } as Partial<User>);

    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    if (dto.churchId) {
      const church = await this.churchRepo.findOne({ where: { id: dto.churchId } });
      if (!church) throw new BadRequestException('Invalid churchId');
      user.church = church;
      user.churchId = dto.churchId;
    }

    return this.userRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }
    const { password, ...rest } = dto;
    Object.assign(user, rest);
    return this.userRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }

  async bulkRemove(ids: string[]): Promise<{ deleted: number }> {
    const result = await this.userRepo.delete(ids);
    return { deleted: result.affected ?? 0 };
  }

  async bulkUpdateStatus(
    ids: string[],
    payload: BulkUpdateUserStatusDto,
  ): Promise<{ updated: number }> {
    const result = await this.userRepo.update(ids, { status: payload.status });
    return { updated: result.affected ?? 0 };
  }
}
