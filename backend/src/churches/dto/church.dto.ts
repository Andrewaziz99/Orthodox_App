import {
  IsString,
  IsOptional,
  IsEmail,
  IsInt,
  IsEnum,
  IsPositive,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChurchDto {
  @IsString()
  @MinLength(2, { message: 'Church name must be at least 2 characters' })
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  maxChildren?: number;
}

export class UpdateChurchDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  maxChildren?: number;

  @IsOptional()
  @IsEnum(['pending', 'active', 'rejected'])
  status?: 'pending' | 'active' | 'rejected';
}
