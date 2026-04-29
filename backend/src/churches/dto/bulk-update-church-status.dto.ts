import { IsIn } from 'class-validator';

export class BulkUpdateChurchStatusDto {
  @IsIn(['pending', 'active', 'rejected'])
  status!: 'pending' | 'active' | 'rejected';
}
