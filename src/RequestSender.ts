import {
  RequestCallback,
  RequestData,
  RequestHeaders,
  RequestOptions,
  SafepayObject,
} from "./types.js";
import { HttpClientResponseInterface } from "./net/HttpClient.js";
import { normalizeHeaders, removeNullish } from "./utils.js";
import {
  SafepayAPIError,
  SafepayAuthenticationError,
  SafepayInvalidRequestError,
  SafepayConflictError,
  SafepayUnknownError,
} from "./Error.js";

export class RequestSender {
  protected _safepay: SafepayObject;

  constructor(safepay: SafepayObject) {
    this._safepay = safepay;
  }

  /**
   * Default handler for Safepay responses. Buffers the response into memory,
   * parses the JSON and returns it (i.e. passes it to the callback) if there
   * is no "error" field. Otherwise constructs/passes an appropriate Error.
   */
  _jsonResponseHandler(callback: RequestCallback) {
    return (res: HttpClientResponseInterface): void => {
      const statusCode = res.getStatusCode();

      res
        .toJSON()
        .then(
          (jsonResponse) => {
            if (statusCode < 400) {
              return jsonResponse;
            }

            const message = { ...jsonResponse, status: statusCode };

            let err;
            if (statusCode === 401) {
              err = new SafepayAuthenticationError(message);
            } else if (statusCode === 400) {
              err = new SafepayInvalidRequestError(message);
            } else if (statusCode === 404) {
              err = new SafepayAPIError(message);
            } else if (statusCode === 409) {
              err = new SafepayConflictError(message);
            } else {
              err = new SafepayUnknownError(message);
            }

            throw err;
          },
          (e: Error) => {
            throw e;
          }
        )
        .then(
          (jsonResponse) => {
            callback(null, jsonResponse);
          },
          (e) => callback(e, null)
        );
    };
  }

  _makeAuthHeader(auth: string | null): [string, string | null] {
    const authHeader =
      this._safepay.getApiField("authType") === "secret"
        ? "x-sfpy-merchant-secret"
        : "Authorization";
    const authPrefix =
      this._safepay.getApiField("authType") === "jwt" ? "Bearer " : "";
    const authValue = auth
      ? `${authPrefix}${auth}`
      : this._safepay.getApiField("auth");

    return [authHeader, authValue];
  }

  _makeHeaders(
    auth: string | null,
    userSuppliedHeaders: RequestHeaders | null
  ): RequestHeaders {
    const defaultHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json",
    } as RequestHeaders;

    const [authHeader, authValue] = this._makeAuthHeader(auth);

    defaultHeaders[authHeader] = authValue || "";

    return Object.assign(
      removeNullish(defaultHeaders),
      // If the user supplied any headers, override instead of appending by ensuring caps are the same.
      normalizeHeaders(userSuppliedHeaders)
    );
  }

  _request(
    method: string,
    host: string | null,
    path: string,
    data: RequestData,
    auth: string | null,
    options: RequestOptions = {},
    callback: RequestCallback
  ): void {
    const makeRequest = (headers: RequestHeaders): void => {
      // timeout can be set on a per-request basis. Favor that over the global setting
      const timeout =
        options.settings &&
        options.settings.timeout &&
        Number.isInteger(options.settings.timeout) &&
        options.settings.timeout >= 0
          ? options.settings.timeout
          : this._safepay.getApiField("timeout");

      const req = this._safepay
        .getApiField("httpClient")
        .makeRequest(
          host || this._safepay.getApiField("host"),
          path,
          method,
          headers,
          data,
          timeout
        );
      req
        .then((res: HttpClientResponseInterface) => {
          return this._jsonResponseHandler(callback)(res);
        })
        .catch((error: Error) => {
          return callback(error);
        });
    };

    const prepareAndMakeRequest = (): void => {
      const headers = this._makeHeaders(auth, options.headers ?? null);

      makeRequest(headers);
    };

    prepareAndMakeRequest();
  }
}
