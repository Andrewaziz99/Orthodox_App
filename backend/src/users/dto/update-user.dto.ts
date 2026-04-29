import { IsOptional, IsString, IsEmail, IsEnum, IsUUID, MinLength } from 'class-validator';

export type UserRole = 'super_admin' | 'church_admin' | 'servant' | 'child';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(['super_admin', 'church_admin', 'servant', 'child'])
  role?: UserRole;

  @IsOptional()
  @IsUUID()
  churchId?: string;

  @IsOptional()
  @IsEnum(['pending', 'active', 'inactive', 'suspended'])
  status?: 'pending' | 'active' | 'inactive' | 'suspended';
}
