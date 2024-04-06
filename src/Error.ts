import { SafepayRawError } from "./types.js";

export class SafepayError extends Error {
  readonly message: string;
  readonly type: string;
  readonly headers?: { [header: string]: string };
  readonly status?: number;

  constructor(raw: SafepayRawError = {}, type: string | null = null) {
    super(raw.message);
    this.type = type || this.constructor.name;
    this.status = raw.status;
    // @ts-ignore
    this.message = raw.message;
  }
}

/**
 * InvalidRequestError is raised when a request is initiated with invalid
 * parameters.
 */
export class SafepayInvalidRequestError extends SafepayError {
  constructor(raw: SafepayRawError = {}) {
    super(raw, "SafepayInvalidRequestError");
  }
}

/**
 * APIError is a generic error that may be raised in cases where none of the
 * other named errors cover the problem. It could also be raised in the case
 * that a new error has been introduced in the API, but this version of the
 * Node.JS SDK doesn't know how to handle it.
 */
export class SafepayAPIError extends SafepayError {
  constructor(raw: SafepayRawError = {}) {
    super(raw, "SafepayAPIError");
  }
}

/**
 * AuthenticationError is raised when invalid credentials are used to connect
 * to Safepay's servers.
 */
export class SafepayAuthenticationError extends SafepayError {
  constructor(raw: SafepayRawError = {}) {
    super(raw, "SafepayAuthenticationError");
  }
}

/**
 * Any other error from Safepay not specifically captured above
 */
export class SafepayUnknownError extends SafepayError {
  constructor(raw: SafepayRawError = {}) {
    super(raw, "SafepayUnknownError");
  }
}
