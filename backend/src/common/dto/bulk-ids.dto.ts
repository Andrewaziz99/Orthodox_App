import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class BulkIdsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  ids!: string[];
}
