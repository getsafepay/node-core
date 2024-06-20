import { HttpClientInterface } from "./net/HttpClient";

export type RequestArgs = Array<any>;
export type RequestData = Record<string, any>;
export type RequestHeaders = Record<string, string | number | string[]>;

export type ResponseHeaderValue = string | string[];
export type ResponseHeaders = Record<string, ResponseHeaderValue>;

export type RequestCallback = (
  this: void,
  error: Error | null,
  response?: any
) => RequestCallbackReturn;
export type RequestCallbackReturn = any;

export type RequestOptions = {
  settings?: RequestSettings;
  headers?: RequestHeaders;
};

export type RequestOpts = {
  requestMethod: string;
  requestPath: string;
  bodyData: RequestData | undefined;
  queryData: RequestData;
  auth: string | null;
  headers: RequestHeaders;
  host: string | null;
  settings: RequestSettings;
};
export type RequestSettings = { timeout?: number };

export type SafepayRawError = {
  message?: string;
  status?: number;
};

export type MethodSpec = {
  method: string;
  urlParams?: Array<string>;
  path?: string;
  fullPath?: string;
  encode?: (data: RequestData) => RequestData;
  validator?: (data: RequestData, options: { headers: RequestHeaders }) => void;
  headers?: Record<string, string>;
  host?: string;
};

export type SafepayResourceConstructor = {
  new (Safepay: SafepayObject): SafepayResourceObject;
};

export type SafepayResourceObject = {
  _safepay: SafepayObject;
  basePath: UrlInterpolator;
  path: UrlInterpolator;
  resourcePath: string;
  createResourcePathWithSymbols: (path: string | null | undefined) => string;
  createFullPath: (
    interpolator: UrlInterpolator,
    urlData: RequestData
  ) => string;
  initialize: (...args: Array<any>) => void;
  _joinUrlParts: (urlParts: string[]) => string;
  _makeRequest(requestArgs: RequestArgs, spec: MethodSpec): Promise<any>;
  _getRequestOpts(requestArgs: RequestArgs, spec: MethodSpec): RequestOpts;
};

export type SafepayConstructor = {
  new (key: string, config: Record<string, unknown>): SafepayObject;
};
declare const Safepay: SafepayConstructor;

export type SafepayObject = {
  _setApiField: <K extends keyof SafepayObject["_api"]>(
    name: K,
    value: SafepayObject["_api"][K]
  ) => void;
  getApiField: <K extends keyof SafepayObject["_api"]>(
    key: K
  ) => SafepayObject["_api"][K];
  SafepayResource: SafepayResourceConstructor;
  _api: {
    auth: string | null;
    host: string;
    timeout: number;
    httpClient: any;
    authType: string;
  };
  _prepResources: () => void;
  _setSessionKey: (session: string) => void;
  _setSecretKey: (secret: string) => void;
  _requestSender: RequestSender;
  _getPropsFromConfig: (config: Record<string, unknown>) => UserProvidedConfig;
  errors: any;
};

export type UrlInterpolator = (params: Record<string, unknown>) => string;

export type RequestSender = {
  _request(
    method: string,
    host: string | null,
    path: string,
    data: RequestData | undefined,
    params: RequestData,
    auth: string | null,
    options: RequestOptions,
    callback: RequestCallback
  ): void;
};

export type UserProvidedConfig = {
  host?: string;
  timeout?: number;
  httpClient?: HttpClientInterface;
  authType?: string;
};

export enum AuthTypes {
  Jwt = "jwt",
  Secret = "secret",
}
