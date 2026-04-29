import { IsString, IsOptional, IsEmail, IsEnum, IsUUID, MinLength } from 'class-validator';

export type UserRole = 'super_admin' | 'church_admin' | 'servant' | 'child';

export class CreateUserDto {
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
  @MinLength(6)
  password?: string;

  @IsEnum(['super_admin', 'church_admin', 'servant', 'child'])
  role!: UserRole;

  @IsOptional()
  @IsUUID()
  churchId?: string;
}
