import { ArrayNotEmpty, IsArray, IsIn, IsUUID } from 'class-validator';

export class BulkChurchActionDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  ids!: string[];

  @IsIn(['pending', 'active', 'rejected'])
  status!: 'pending' | 'active' | 'rejected';
}
