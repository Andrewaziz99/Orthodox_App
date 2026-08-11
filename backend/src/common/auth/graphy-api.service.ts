import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GraphyApiService {
  constructor(private readonly config: ConfigService) {}

  async getCurrentUser(authorization: string): Promise<unknown> {
    const response = await this.request('/auth/me', authorization);
    if (response.status === 401 || response.status === 403) {
      throw new UnauthorizedException('Graphy session is not active');
    }
    if (response.status === 429) {
      throw new HttpException(
        'Graphy rate limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (!response.ok) {
      throw new ServiceUnavailableException('Unable to verify Graphy session');
    }
    try {
      return await response.json();
    } catch {
      throw new UnauthorizedException('Invalid response from Graphy');
    }
  }

  async assertCurriculumExists(
    curriculumId: string,
    authorization: string,
  ): Promise<void> {
    const response = await this.request(
      `/curricula/${curriculumId}`,
      authorization,
    );
    if (response.status === 404) {
      throw new BadRequestException('Graphy curriculum does not exist');
    }
    if (response.status === 401 || response.status === 403) {
      throw new UnauthorizedException('Graphy session cannot read curricula');
    }
    if (!response.ok) {
      throw new ServiceUnavailableException(
        'Unable to verify Graphy curriculum',
      );
    }
  }

  private async request(
    path: string,
    authorization: string,
  ): Promise<Response> {
    const configuredUrl = this.config.get<string>('GRAPHY_API_URL')?.trim();
    const baseUrl = configuredUrl || 'http://localhost:3000/api/v1';
    try {
      return await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, {
        headers: { accept: 'application/json', authorization },
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      throw new ServiceUnavailableException('Unable to reach Graphy');
    }
  }
}
