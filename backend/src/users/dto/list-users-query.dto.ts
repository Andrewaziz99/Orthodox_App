import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['super_admin', 'church_admin', 'servant', 'child'])
  role?: 'super_admin' | 'church_admin' | 'servant' | 'child';

  @IsOptional()
  @IsIn(['pending', 'active', 'inactive', 'suspended'])
  status?: 'pending' | 'active' | 'inactive' | 'suspended';

  @IsOptional()
  @IsString()
  churchId?: string;
}
