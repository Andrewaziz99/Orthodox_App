import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  titleAr!: string;

  @IsString()
  @IsNotEmpty()
  titleEn!: string;

  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;

  @IsUrl()
  videoUrl!: string;

  @IsBoolean()
  @IsOptional()
  isYoutube?: boolean;

  @IsInt()
  @IsOptional()
  order?: number;
}

export class UpdateVideoDto extends CreateVideoDto {}
