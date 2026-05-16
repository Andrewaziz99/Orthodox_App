import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChurchesService } from './churches.service';
import { CreateChurchDto, UpdateChurchDto } from './dto/church.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('churches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChurchesController {
  constructor(private readonly churchesService: ChurchesService) {}

  @Get()
  @Roles('super_admin', 'church_admin')
  findAll(
    @Query('search') search?: string,
    @Query('page')   page?:   number,
    @Query('limit')  limit?:  number,
    @Query('status') status?: string,
  ) {
    return this.churchesService.findAll({ search, page, limit, status });
  }

  @Get(':id')
  @Roles('super_admin', 'church_admin')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.churchesService.findOne(id);
  }

  @Post()
  @Roles('super_admin')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateChurchDto) {
    return this.churchesService.create(dto);
  }

  @Patch(':id')
  @Roles('super_admin')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateChurchDto,
  ) {
    return this.churchesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.churchesService.remove(id);
  }
}
