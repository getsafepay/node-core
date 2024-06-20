declare module "@sfpy/node-core" {
    namespace Safepay {
        type SafepayRawError = {
            message?: string;
            status?: number;
        };
        namespace errors {
            class SafepayError extends Error {
                constructor(raw: SafepayRawError, type: string | null);
                readonly message: string;
                readonly type: string;
                readonly headers?: { [header: string]: string };
                readonly status?: number;
            };
            class SafepayInvalidRequestError extends SafepayError {
                readonly type: 'SafepayInvalidRequestError';
            };
            class SafepayAPIError extends SafepayError {
                readonly type: 'SafepayAPIError';
            };
            class SafepayAuthenticationError extends SafepayError {
                readonly type: 'SafepayAuthenticationError';
            };
            class SafepayConflictError extends SafepayError {
                readonly type: 'SafepayConflictError';
            };
            class SafepayUnknownError extends SafepayError {
                readonly type: 'SafepayUnknownError';
            };
        }
    }
}
