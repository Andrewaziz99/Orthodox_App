import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Church } from './church.entity';
import { ChurchesController } from './churches.controller';
import { ChurchesService } from './churches.service';

@Module({
  imports: [TypeOrmModule.forFeature([Church])],
  controllers: [ChurchesController],
  providers: [ChurchesService],
  exports: [ChurchesService],
})
export class ChurchesModule {}
