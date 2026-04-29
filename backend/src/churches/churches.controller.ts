import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChurchesService } from './churches.service';
import type { CreateChurchDto } from './dto/create-church.dto';
import type { UpdateChurchDto } from './dto/update-church.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ListChurchesQueryDto } from './dto/list-churches-query.dto';
import { BulkChurchActionDto } from './dto/bulk-church-action.dto';

@Controller('churches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChurchesController {
  constructor(private readonly svc: ChurchesService) {}

  // Admins can list churches
  @Get()
  list(@Query() query: ListChurchesQueryDto) {
    return this.svc.findAll(query);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  // Only super admins can create churches
  @Post()
  @Roles('super_admin')
  create(@Body() body: CreateChurchDto) {
    return this.svc.create(body);
  }

  @Patch(':id')
  @Roles('super_admin')
  update(@Param('id') id: string, @Body() body: UpdateChurchDto) {
    return this.svc.update(id, body);
  }

  @Delete(':id')
  @Roles('super_admin')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }

  @Delete('bulk')
  @Roles('super_admin')
  bulkRemove(@Body() body: BulkChurchActionDto) {
    return this.svc.bulkRemove(body.ids);
  }

  @Patch('bulk/status')
  @Roles('super_admin')
  bulkUpdateStatus(@Body() body: BulkChurchActionDto) {
    return this.svc.bulkUpdateStatus(body.ids, { status: body.status });
  }
}
