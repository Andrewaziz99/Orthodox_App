import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { GraphyApiService } from './graphy-api.service';

export interface GraphyUser extends Record<string, unknown> {
  role?: string;
  type?: string;
  active?: boolean;
  isActive?: boolean;
  is_active?: boolean;
  status?: string;
}

interface GraphyAuthenticatedRequest extends Request {
  user?: GraphyUser;
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@Injectable()
export class GraphyAuthGuard implements CanActivate {
  constructor(private readonly graphyApi: GraphyApiService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<GraphyAuthenticatedRequest>();
    const authorization = request.headers.authorization;

    if (!authorization || !/^Bearer\s+\S+$/i.test(authorization)) {
      throw new UnauthorizedException('Bearer token required');
    }

    request.user = await this.getGraphyUser(authorization);
    return true;
  }

  private async getGraphyUser(authorization: string): Promise<GraphyUser> {
    const sessionPayload = await this.graphyApi.getCurrentUser(authorization);

    const graphyUser =
      isJsonObject(sessionPayload) && isJsonObject(sessionPayload.user)
        ? sessionPayload.user
        : sessionPayload;

    if (!isJsonObject(graphyUser) || this.isInactive(graphyUser)) {
      throw new UnauthorizedException('Graphy session is not active');
    }

    return graphyUser;
  }

  private isInactive(user: GraphyUser): boolean {
    return (
      user.active === false ||
      user.isActive === false ||
      user.is_active === false ||
      user.status === 'inactive'
    );
  }
}
