import { IsOptional, IsString, IsEmail, IsInt, Min } from 'class-validator';

export class UpdateChurchDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxChildren?: number;

  @IsOptional()
  @IsString()
  status?: 'pending' | 'active' | 'rejected';
}
