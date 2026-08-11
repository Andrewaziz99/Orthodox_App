import { Module } from '@nestjs/common';
import { GraphyAuthGuard } from './graphy-auth.guard';
import { GraphyApiService } from './graphy-api.service';
import { RolesGuard } from './roles.guard';

@Module({
  providers: [GraphyApiService, GraphyAuthGuard, RolesGuard],
  exports: [GraphyApiService, GraphyAuthGuard, RolesGuard],
})
export class CmsAuthModule {}
