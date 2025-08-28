import { Injectable } from '@nestjs/common';
import { err } from 'neverthrow';
import { GetUserProfileUseCase } from 'src/user/use-cases/get-user-profile.use-case';
import { AppError } from '@repo/api/error';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthenticateWithRefreshTokenUseCase {
  constructor(
    private readonly getUser: GetUserProfileUseCase,
    private readonly authService: AuthService,
  ) { }

  async execute(userId: string) {
    const userResult = await this.getUser.execute(userId);

    if (userResult.isErr()) {
      return err(AppError.unauthorized('Invalid refresh token'));
    }

    return this.authService.createAuthResponse(userResult.value, false);
  }
}
