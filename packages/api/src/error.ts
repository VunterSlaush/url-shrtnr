export enum AppErrorType {
    NOT_FOUND = 'NOT_FOUND',
    CONFLICT = 'CONFLICT',
    VALIDATION = 'VALIDATION',
    UNHANDLED = 'UNHANDLED',
    UNAUTHORIZED = 'UNAUTHORIZED'
}

type Cause = Error | string | unknown;

export class AppError extends Error {
    constructor(
        public readonly type: AppErrorType,
        message: string,
        cause?: Cause
    ) {
        super(message, cause);
        this.name = `AppError[${this.type}]`;
    }

    static notFound(message: string, cause?: Cause): AppError {
        return new AppError(AppErrorType.NOT_FOUND, message, cause);
    }

    static conflict(message: string, cause?: Cause): AppError {
        return new AppError(AppErrorType.CONFLICT, message, cause);
    }

    static validation(message: string, cause?: Cause): AppError {
        return new AppError(AppErrorType.VALIDATION, message, cause);
    }

    static unhandled(message: string, cause?: Cause): AppError {
        return new AppError(AppErrorType.UNHANDLED, message, cause);
    }

    static unauthorized(message: string, cause?: Cause): AppError {
        return new AppError(AppErrorType.UNAUTHORIZED, message, cause);
    }

    isNotFound(): boolean {
        return this.type === AppErrorType.NOT_FOUND;
    }

    isConflict(): boolean {
        return this.type === AppErrorType.CONFLICT;
    }

    isValidation(): boolean {
        return this.type === AppErrorType.VALIDATION;
    }

    isUnhandled(): boolean {
        return this.type === AppErrorType.UNHANDLED;
    }
}

export class HttpError extends Error {
    constructor(public readonly statusCode: number, message: string) {
        super(message);
    }
}

export function mapAppErrorToHttpError(appError: AppError): HttpError {
    switch (appError.type) {
        case AppErrorType.NOT_FOUND:
            return new HttpError(404, appError.message);
        case AppErrorType.CONFLICT:
            return new HttpError(409, appError.message);
        case AppErrorType.VALIDATION:
            return new HttpError(400, appError.message);
        case AppErrorType.UNHANDLED:
            return new HttpError(500, appError.message);
        default:
            return new HttpError(500, appError.message);
    }
}