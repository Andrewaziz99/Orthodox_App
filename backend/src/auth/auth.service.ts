import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { OtpCode } from './otp.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(OtpCode) private otpRepo: Repository<OtpCode>, // ← single consistent name
    private jwtService: JwtService,
  ) {}

  // ─── Endpoint 1: Super Admin Login ───────────────────────────
  async loginSuperAdmin(email: string, password: string) {
    const isDevBootstrapEmail =
      email === 'admin@bibleschool.com' && password === 'Admin@1234';

    if (isDevBootstrapEmail) {
      const existingAdmin = await this.usersRepo.findOne({
        where: { email, role: 'super_admin' },
      });

      const passwordHash = await bcrypt.hash(password, 10);
      const adminUser =
        existingAdmin ??
        this.usersRepo.create({
          name: 'Admin',
          email,
          role: 'super_admin',
          status: 'active',
        } as Partial<User>);

      adminUser.passwordHash = passwordHash;
      await this.usersRepo.save(adminUser);

      return this.signToken(adminUser);
    }

    const user = await this.usersRepo.findOne({
      where: { email, role: 'super_admin' },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return this.signToken(user);
  }

  // ─── Endpoint 2: Send OTP ─────────────────────────────────────
  async sendOtp(phone: string): Promise<{ message: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Delete old OTPs for this phone
    await this.otpRepo.delete({ phone }); // ← fixed: was this.otpRepository

    // Save new OTP
    await this.otpRepo.save({ phone, code, expiresAt, used: false }); // ← fixed

    // Send via Cequens (falls back to console.log in development)
    if (process.env.CEQUENS_API_TOKEN) {
      await this.sendSms(phone, `Your Bible School verification code is: ${code}`);
    } else {
      console.log(`[DEV] OTP for ${phone}: ${code}`);
    }

    return { message: 'OTP sent successfully' };
  }

  private async sendSms(to: string, message: string): Promise<void> {
    const response = await fetch('https://apis.cequens.com/sms/v1/messages', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${process.env.CEQUENS_API_TOKEN}`,
      },
      body: JSON.stringify({
        senderName: process.env.CEQUENS_SENDER_NAME || 'BibleSchool',
        messageType: 'text',
        shortURL: false,
        recipients: [{ msisdn: to }],
        messageText: message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`SMS failed: ${error.message}`);
    }
  }

  // ─── Endpoint 3: Verify OTP ───────────────────────────────────
  async verifyOtp(phone: string, code: string) {
    const otp = await this.otpRepo.findOne({
      where: { phone, code, used: false },
    });

    if (!otp) throw new BadRequestException('Invalid OTP');

    if (new Date() > otp.expiresAt)
      throw new BadRequestException('OTP has expired');

    // Mark OTP as used
    await this.otpRepo.save({ ...otp, used: true });

    // Find user — must be invited by church admin first
    const user = await this.usersRepo.findOne({ where: { phone } });

    if (!user)
      throw new UnauthorizedException(
        'User not found. Ask your church admin to invite you first.',
      );

    return this.signToken(user);
  }

  // ─── Helper: Sign JWT ─────────────────────────────────────────
  private signToken(user: User) {
    const payload = {
      sub: user.id,
      id: user.id,         // ← added: Flutter decoder reads 'id'
      name: user.name,     // ← added: needed by Flutter HomeHeader
      email: user.email,   // ← added
      phone: user.phone,   // ← added
      role: user.role,
      churchId: user.churchId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }
}
