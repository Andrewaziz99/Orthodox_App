import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphyApiService } from './graphy-api.service';
import { GraphyAuthGuard } from './graphy-auth.guard';

function httpContext(request: {
  headers: { authorization?: string };
  user?: unknown;
}) {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as ExecutionContext;
}

describe('GraphyAuthGuard', () => {
  afterEach(() => jest.restoreAllMocks());

  it('attaches the active Graphy session to the CMS request', async () => {
    const graphyUser = { id: 'user-id', type: 'super_admin' };
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(graphyUser), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    const request = { headers: { authorization: 'Bearer access-token' } };
    const guard = new GraphyAuthGuard(
      new GraphyApiService(new ConfigService()),
    );

    await expect(guard.canActivate(httpContext(request))).resolves.toBe(true);
    expect(request).toHaveProperty('user', graphyUser);
  });

  it('rejects a token that Graphy does not accept', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(null, { status: 401 }));
    const guard = new GraphyAuthGuard(
      new GraphyApiService(new ConfigService()),
    );
    const request = { headers: { authorization: 'Bearer rejected-token' } };

    await expect(
      guard.canActivate(httpContext(request)),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
