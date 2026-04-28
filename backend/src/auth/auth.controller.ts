import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: string; role: string; churchId: string | null };
}

class LoginDto {
  readonly email!: string;
  readonly password!: string;
}

class SendOtpDto {
  readonly phone!: string;
}

class VerifyOtpDto {
  readonly phone!: string;
  readonly code!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.loginSuperAdmin(body.email, body.password);
  }

  @Post('otp/send')
  sendOtp(@Body() body: SendOtpDto) {
    return this.authService.sendOtp(body.phone);
  }

  @Post('otp/verify')
  verifyOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyOtp(body.phone, body.code);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  getMe(@Request() req: AuthenticatedRequest) {
    return req.user;
  }
}
