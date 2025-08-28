import { User } from "@repo/api/users/user";

export type AuthToken = {
    token: string;
    expiresInSeconds: number;
};

export type AuthResponseDto = {
    user: User;
    accessToken: AuthToken;
    refreshToken: AuthToken | null;
};