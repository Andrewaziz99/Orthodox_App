import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { BulkUserActionDto } from './dto/bulk-user-action.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get()
  list(@Query() query: ListUsersQueryDto) {
    return this.svc.findAll(query);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  @Roles('super_admin', 'church_admin')
  create(@Body() body: CreateUserDto) {
    return this.svc.create(body);
  }

  @Patch(':id')
  @Roles('super_admin', 'church_admin')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.svc.update(id, body);
  }

  @Delete(':id')
  @Roles('super_admin')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }

  @Delete('bulk')
  @Roles('super_admin')
  bulkRemove(@Body() body: BulkUserActionDto) {
    return this.svc.bulkRemove(body.ids);
  }

  @Patch('bulk/status')
  @Roles('super_admin', 'church_admin')
  bulkUpdateStatus(@Body() body: BulkUserActionDto) {
    return this.svc.bulkUpdateStatus(body.ids, { status: body.status });
  }
}
