import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;
    const state = encodeURIComponent(JSON.stringify(getUrlParams(request.url)));
    return {
      state,
    };
  }
}

function getUrlParams(urlStr: string) {
  const url = new URLSearchParams(urlStr.replace('/auth/oauth/google?', ''));
  return Object.fromEntries(url.entries());
}
