import {
  RequestArgs,
  RequestData,
  RequestHeaders,
  SafepayResourceObject,
  UrlInterpolator,
} from "./types.js";

const OPTIONS_KEYS = ["secret", "jwt", "timeout", "ipAddress", "userAgent"];

type Settings = {
  timeout?: number;
};

type Options = {
  auth: string | null;
  host: string | null;
  headers: Record<string, unknown>;
  settings: Settings;
};

export function isOptionsHash(o: unknown): boolean | unknown {
  return (
    o &&
    typeof o === "object" &&
    OPTIONS_KEYS.some((prop) => Object.prototype.hasOwnProperty.call(o, prop))
  );
}

/**
 * Return the options hash from a list of arguments
 */
export function getOptionsFromArgs(args: RequestArgs): Options {
  const opts: Options = {
    auth: null,
    host: null,
    headers: {},
    settings: {},
  };
  if (args.length > 0) {
    const arg = args[args.length - 1];
    if (typeof arg === "string") {
      opts.auth = args.pop() as string;
    } else if (isOptionsHash(arg)) {
      const params = { ...(args.pop() as Record<string, unknown>) };

      const extraKeys = Object.keys(params).filter(
        (key) => !OPTIONS_KEYS.includes(key)
      );

      if (extraKeys.length) {
        emitWarning(
          `Invalid options found (${extraKeys.join(", ")}); ignoring.`
        );
      }

      if (params.jwt) {
        opts.auth = params.jwt as string;
      }
      if (params.secret) {
        opts.auth = params.secret as string;
      }
      if (params.host) {
        opts.host = params.host as string;
      }
      if (Number.isInteger(params.timeout)) {
        opts.settings.timeout = params.timeout as number;
      }
      if (params.ipAddress) {
        opts.headers["X-SFPY-IP-ADDRESS"] = params.ipAddress;
      }
      if (params.userAgent) {
        opts.headers["X-SFPY-USER-AGENT"] = params.userAgent;
      }
    }
  }
  return opts;
}

/**
 * Return the data argument from a list of arguments
 *
 * @param {object[]} args
 * @returns {object}
 */
export function getDataFromArgs(args: RequestArgs): RequestData {
  if (!Array.isArray(args) || !args[0] || typeof args[0] !== "object") {
    return {};
  }

  if (!isOptionsHash(args[0])) {
    return args.shift();
  }

  if (args[0] instanceof FormData) {
    return args[0];
  }

  return args.shift();
}

export function extractUrlParams(path: string): Array<string> {
  const params = path.match(/\{\w+\}/g);
  if (!params) {
    return [];
  }

  return params.map((param) => param.replace(/[{}]/g, ""));
}

/**
 * Outputs a new function with interpolated object property values.
 * Use like so:
 *   const fn = makeURLInterpolator('some/url/{param1}/{param2}');
 *   fn({ param1: 123, param2: 456 }); // => 'some/url/123/456'
 */
export const makeURLInterpolator = ((): ((s: string) => UrlInterpolator) => {
  const rc = {
    "\n": "\\n",
    '"': '\\"',
    "\u2028": "\\u2028",
    "\u2029": "\\u2029",
  } as Record<string, string>;
  return (str: string): UrlInterpolator => {
    const cleanString = str.replace(/["\n\r\u2028\u2029]/g, ($0) => rc[$0]);
    return (outputs: Record<string, unknown>): string => {
      return cleanString.replace(/\{([\s\S]+?)\}/g, ($0, $1) =>
        // @ts-ignore
        encodeURIComponent(outputs[$1] || "")
      );
    };
  };
})();

/**
 * Allow for special capitalization cases (such as OAuth)
 */
export function pascalToCamelCase(name: string): string {
  if (name === "OAuth") {
    return "oauth";
  } else {
    return name[0].toLowerCase() + name.substring(1);
  }
}
/**
 * Provide simple "Class" extension mechanism.
 * <!-- Public API accessible via Safepay.SafepayResource.extend -->
 */
export function protoExtend(
  this: any,
  sub: any
): { new (...args: any[]): SafepayResourceObject } {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const Super = this;
  const Constructor = Object.prototype.hasOwnProperty.call(sub, "constructor")
    ? sub.constructor
    : function (this: SafepayResourceObject, ...args: any[]): void {
        Super.apply(this, args);
      };

  // This initialization logic is somewhat sensitive to be compatible with
  // divergent JS implementations like the one found in Qt.

  Object.assign(Constructor, Super);
  Constructor.prototype = Object.create(Super.prototype);
  Object.assign(Constructor.prototype, sub);

  return Constructor;
}

export function emitWarning(warning: string): void {
  if (typeof process.emitWarning !== "function") {
    return console.warn(
      `Safepay: ${warning}`
    ); /* eslint-disable-line no-console */
  }

  return process.emitWarning(warning, "Safepay");
}

/**
 * Remove empty values from an object
 */
export function removeNullish<T extends Record<string, unknown>>(obj: T): T {
  if (typeof obj !== "object") {
    throw new Error("Argument must be an object");
  }

  return Object.keys(obj).reduce<Record<string, unknown>>((result, key) => {
    if (obj[key] != null) {
      result[key] = obj[key];
    }
    return result;
  }, {}) as T;
}

/**
 * Normalize standard HTTP Headers:
 * {'foo-bar': 'hi'}
 * becomes
 * {'Foo-Bar': 'hi'}
 */
export function normalizeHeaders(
  obj: RequestHeaders | null
): RequestHeaders | null {
  if (!(obj && typeof obj === "object")) {
    return obj;
  }

  return Object.keys(obj).reduce<RequestHeaders>((result, header) => {
    result[normalizeHeader(header)] = obj[header];
    return result;
  }, {});
}

/**
 * Stolen from https://github.com/marten-de-vries/header-case-normalizer/blob/master/index.js#L36-L41
 * without the exceptions which are irrelevant to us.
 */
export function normalizeHeader(header: string): string {
  return header
    .split("-")
    .map((text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase())
    .join("-");
}

export function validateInteger(
  name: string,
  n: unknown,
  defaultVal?: number
): number {
  if (!Number.isInteger(n)) {
    if (defaultVal !== undefined) {
      return defaultVal;
    } else {
      throw new Error(`${name} must be an integer`);
    }
  }

  return n as number;
}
