import * as _Error from "./Error.js";
import { RequestSender } from "./RequestSender.js";
import { SafepayObject, UserProvidedConfig } from "./types.js";
import { SafepayResource } from "./SafepayResource.js";
import { HttpClient, HttpClientResponse } from "./net/HttpClient.js";
import { validateInteger, pascalToCamelCase } from "./utils.js";
import { AxiosHttpClient } from "./net/AxiosHttpClient.js";
import * as resources from "./resources.js";

const DEFAULT_HOST = "api.getsafepay.com";

const DEFAULT_TIMEOUT = 80000;
const DEFAULT_AUTH_TYPE = "secret";
const AUTH_TYPES = ["jwt", "secret"];
const ALLOWED_CONFIG_PROPERTIES = [
  "httpClient",
  "timeout",
  "host",
  "authType",
];

type RequestSenderFactory = (safepay: SafepayObject) => RequestSender;

const defaultRequestSenderFactory: RequestSenderFactory = (safepay) =>
  new RequestSender(safepay);

export function createSafepay(
  requestSender: RequestSenderFactory = defaultRequestSenderFactory
): typeof Safepay {
  Safepay.SafepayResource = SafepayResource;
  Safepay.HttpClient = HttpClient;
  Safepay.HttpClientResponse = HttpClientResponse;

  function Safepay(
    this: SafepayObject,
    key: string,
    config: Record<string, unknown> = {}
  ): void {
    if (!(this instanceof Safepay)) {
      return new (Safepay as any)(key, config);
    }

    const props = this._getPropsFromConfig(config);

    this._api = {
      auth: null,
      host: props.host || DEFAULT_HOST,
      timeout: validateInteger(
        "timeout",
        props.timeout,
        DEFAULT_TIMEOUT
      ),
      httpClient: props.httpClient || new AxiosHttpClient(),
      authType: props.authType || DEFAULT_AUTH_TYPE,
    };

    this._prepResources();

    if (this._api.authType === DEFAULT_AUTH_TYPE) {
      this._setSecretKey(key);
    } else {
      this._setSessionKey(key);
    }

    this._setApiField("authType", this._api.authType);

    this.errors = _Error;

    this._requestSender = requestSender(this);

    // Expose SafepayResource on the instance too
    // @ts-ignore
    this.SafepayResource = Safepay.SafepayResource;
  }

  Safepay.errors = _Error;

  Safepay.prototype = {
    SafepayResource: null!,
    _api: null!,
    errors: null!,
    _requestSender: null!,

    /**
     * @private
     */
    _setSessionKey(key: string): void {
      if (key) {
        this._setApiField("auth", `Bearer ${key}`);
      }
    },

    /**
     * @private
     */
    _setSecretKey(key: string): void {
      if (key) {
        this._setApiField("auth", key);
      }
    },

    /**
     * @private
     * This may be removed in the future.
     */
    _setApiField<K extends keyof SafepayObject["_api"]>(
      key: K,
      value: SafepayObject["_api"][K]
    ): void {
      this._api[key] = value;
    },

    /**
     * @private
     *
     * It may be deprecated and removed in the future.
     */
    getApiField<K extends keyof SafepayObject["_api"]>(
      key: K
    ): SafepayObject["_api"][K] {
      return this._api[key];
    },

    /**
     * @private
     * This may be removed in the future.
     */
    _prepResources(): void {
      for (const name in resources) {
        // @ts-ignore
        this[pascalToCamelCase(name)] = new resources[name](this);
      }
    },

    /**
     * @private
     * This may be removed in the future.
     */
    _getPropsFromConfig(
      config: Record<string, unknown>
    ): UserProvidedConfig {
      // If config is null or undefined, just bail early with no props
      if (!config) {
        throw new Error("Config object may not be empty");
      }

      // config can only be an object
      const isObject =
        config === Object(config) && !Array.isArray(config);

      if (!isObject) {
        throw new Error("Config must be an object");
      }

      // If config is an object, we assume the new behavior and make sure it doesn't contain any unexpected values
      const values = Object.keys(config).filter(
        (value) => !ALLOWED_CONFIG_PROPERTIES.includes(value)
      );

      if (config.authType) {
        if (!AUTH_TYPES.includes(config.authType as string)) {
          throw new Error(
            `authType may be one of ${AUTH_TYPES.join(", ")}`
          );
        }
      }

      if (values.length > 0) {
        throw new Error(
          `Config object may only contain the following: ${ALLOWED_CONFIG_PROPERTIES.join(
            ", "
          )}`
        );
      }

      return config;
    },
  } as SafepayObject;

  return Safepay;
}
