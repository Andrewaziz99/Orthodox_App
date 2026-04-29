import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Church } from './church.entity';
import { ChurchesService } from './churches.service';
import { ChurchesController } from './churches.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Church, User])],
  providers: [ChurchesService],
  controllers: [ChurchesController],
  exports: [ChurchesService],
})
export class ChurchesModule {}
