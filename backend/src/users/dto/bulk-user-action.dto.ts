import { ArrayNotEmpty, IsArray, IsIn, IsUUID } from 'class-validator';

export class BulkUserActionDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  ids!: string[];

  @IsIn(['pending', 'active', 'inactive', 'suspended'])
  status!: 'pending' | 'active' | 'inactive' | 'suspended';
}
