import { Request, Response, CookieOptions } from "express";
import { AuthResponseDto } from "./auth.types";


export const ACCESS_DURATION = 15 * 60 * 1000;

export const REFRESH_TOKEN_DURATION = 30 * 24 * 60 * 60 * 1000; // 1 month in milliseconds


export enum COOKIE {
    AccessToken = 'access_token',
    RefreshToken = 'refresh_token',
}

export const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secure: true,
    /**
     * expiry time relative to the current time in **milliseconds**
     */
    maxAge: ACCESS_DURATION,
};

export const COOKIE_CONFIG: Record<COOKIE, CookieOptions> = {
    [COOKIE.AccessToken]: {
        ...DEFAULT_COOKIE_OPTIONS,
    },
    [COOKIE.RefreshToken]: {
        ...DEFAULT_COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_DURATION,
    },
};


const getCookieDomain = (hostname: string): string => {
    return hostname.replace(/.*(\.[a-zA-Z]+)(\.[a-zA-Z]+).*|localhost/, '$1$2');
};

export function setAuthCookies(res: Response, authUser: AuthResponseDto) {
    const domain = getCookieDomain(res.req.hostname);
    const secure = res.req.hostname !== 'localhost';


    res.cookie(COOKIE.AccessToken, authUser.accessToken.token, {
        ...COOKIE_CONFIG[COOKIE.AccessToken],
        domain,
        secure,
    });

    if (authUser.refreshToken) {
        res.cookie(COOKIE.RefreshToken, authUser.refreshToken.token, {
            ...COOKIE_CONFIG[COOKIE.RefreshToken],
            domain,
            secure,
        });
    }
}

export function cookieExtractor(req: Request) {
    let token = null;
    if (req && req.cookies && req.cookies.Authorization) {
        token = req.cookies.Authorization.replace('Bearer ', '');
    }

    if (req && req.cookies && req.cookies.Authentication) {
        token = req.cookies.Authentication.replace('Bearer ', '');
    }

    if (req && req.cookies && req.cookies.access_token) {
        token = req.cookies.access_token.replace('Bearer ', '');
    }

    return token;
}

export function refreshCookieExtractor(req: Request) {
    let token = null;

    if (req && req.cookies && req.cookies.refresh_token) {
        token = req.cookies.refresh_token.replace('Bearer ', '');
    }

    if (req && req.cookies && req.cookies.Authorization) {
        token = req.cookies.Authorization.replace('Bearer ', '');
    }

    return token;
}