export const toErrorString = (error: unknown): string => {
    if (error && typeof error === 'object' && 'response' in error) {
        const errorWithResponse = error as { response: { data: { message: string } } };
        return errorWithResponse.response.data.message || 'An unexpected error occurred :(';
    }

    if (error && typeof error === 'object' && 'message' in error) {
        const errorWithMessage = error as { message: string };
        return errorWithMessage.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unexpected error occurred :(';
};