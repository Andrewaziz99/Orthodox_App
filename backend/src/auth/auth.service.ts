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
    @InjectRepository(OtpCode) private otpRepo: Repository<OtpCode>,
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
      const adminUser = existingAdmin ?? this.usersRepo.create({
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
  async sendOtp(phone: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Delete any old OTPs for this phone
    await this.otpRepo.delete({ phone });

    // Save new OTP
    await this.otpRepo.save({ phone, code, expiresAt, used: false });

    // TODO: Send via Twilio/Firebase SMS later
    // For now, log it during development
    console.log(`OTP for ${phone}: ${code}`);

    return { message: 'OTP sent successfully' };
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

    // Find or create the user
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
      role: user.role,
      churchId: user.churchId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }
}
