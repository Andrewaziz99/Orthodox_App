import { IsString, IsOptional, IsEmail, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AdminCreateDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  password?: string;
}

export class CreateChurchDto {
  @IsString()
  name!: string;

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
  @ValidateNested()
  @Type(() => AdminCreateDto)
  admin?: AdminCreateDto;
}
