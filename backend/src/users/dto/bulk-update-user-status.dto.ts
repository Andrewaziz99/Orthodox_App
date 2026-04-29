import { IsIn } from 'class-validator';

export class BulkUpdateUserStatusDto {
  @IsIn(['pending', 'active', 'inactive', 'suspended'])
  status!: 'pending' | 'active' | 'inactive' | 'suspended';
}
