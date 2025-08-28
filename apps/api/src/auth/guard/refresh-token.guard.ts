import {
  type CanActivate,
  type ExecutionContext,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Observable } from 'rxjs';

export class RefreshTokenGuard extends AuthGuard('refreshToken') implements CanActivate {
  private readonly logger = new Logger(RefreshTokenGuard.name);

  constructor() {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      return super.canActivate(context);
    }
    catch (err) {
      this.logger.log('Cannot parse Refresh Token');
    }

    return false;
  }
}
