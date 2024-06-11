import {
  getDataFromArgs,
  makeURLInterpolator,
  getOptionsFromArgs,
  protoExtend,
} from "./utils.js";
import { safepayMethod } from "./SafepayMethod.js";
import {
  SafepayResourceObject,
  SafepayObject,
  RequestArgs,
  MethodSpec,
  RequestData,
  RequestOpts,
  UrlInterpolator,
} from "./types.js";
import { HttpClientResponseInterface } from "./net/HttpClient.js";

// Provide extension mechanism for Safepay Resource Sub-Classes
SafepayResource.extend = protoExtend;

// Expose method-creator
SafepayResource.method = safepayMethod;

/**
 * Encapsulates request logic for a Safepay Resource
 */
function SafepayResource(
  this: SafepayResourceObject,
  safepay: SafepayObject
): void {
  this._safepay = safepay;

  this.basePath = makeURLInterpolator(
    // @ts-ignore changing type of basePath
    this.basePath
  );

  // @ts-ignore changing type of path
  this.resourcePath = this.path;
  // @ts-ignore changing type of path
  this.path = makeURLInterpolator(this.path);

  this.initialize(...arguments);
}

SafepayResource.prototype = {
  _safepay: null as SafepayObject | null,
  // @ts-ignore the type of path changes in ctor
  path: "" as UrlInterpolator,
  resourcePath: "",

  // Methods can set basePath with this setting e.g '/order' or '/client'.
  basePath: null!,

  initialize(): void {},

  createFullPath(
    commandPath: string | ((urlData: Record<string, unknown>) => string),
    urlData: Record<string, unknown>
  ): string {
    const urlParts = [this.basePath(urlData), this.path(urlData)];

    if (typeof commandPath === "function") {
      const computedCommandPath = commandPath(urlData);
      // If we have no actual command path, we just omit it to avoid adding a
      // trailing slash. This is important for top-level listing requests, which
      // do not have a command path.
      if (computedCommandPath) {
        urlParts.push(computedCommandPath);
      }
    } else {
      urlParts.push(commandPath);
    }

    return this._joinUrlParts(urlParts);
  },

  // Creates a relative resource path with symbols left in (unlike
  // createFullPath which takes some data to replace them with). For example it
  // might produce: /invoices/{id}
  createResourcePathWithSymbols(pathWithSymbols: string | null): string {
    // If there is no path beyond the resource path, we want to produce just
    // /<resource path> rather than /<resource path>/.
    if (pathWithSymbols) {
      return `/${this._joinUrlParts([this.resourcePath, pathWithSymbols])}`;
    } else {
      return `/${this.resourcePath}`;
    }
  },

  _joinUrlParts(parts: Array<string>): string {
    // Replace any accidentally doubled up slashes. This previously used
    // path.join, which would do this as well. Unfortunately we need to do this
    // as the functions for creating paths are technically part of the public
    // interface and so we need to preserve backwards compatibility.
    return parts.join("/").replace(/\/{2,}/g, "/");
  },

  _getRequestOpts(requestArgs: RequestArgs, spec: MethodSpec): RequestOpts {
    // Extract spec values with defaults.
    const requestMethod = (spec.method || "GET").toUpperCase();
    const urlParams = spec.urlParams || [];

    const isUsingFullPath = !!spec.fullPath;
    const commandPath: UrlInterpolator = makeURLInterpolator(
      isUsingFullPath ? spec.fullPath! : spec.path || ""
    );

    // When using fullPath, we ignore the resource path as it should already be
    // fully qualified.
    const path = isUsingFullPath
      ? spec.fullPath
      : this.createResourcePathWithSymbols(spec.path);

    // Don't mutate args externally.
    const args: RequestArgs = [].slice.call(requestArgs);

    // Generate and validate url params.
    const urlData = urlParams.reduce<RequestData>((urlData, param) => {
      const arg = args.shift();
      if (typeof arg !== "string") {
        throw new Error(
          `Safepay: Argument "${param}" must be a string, but got: ${arg} (on API request to \`${requestMethod} ${path}\`)`
        );
      }

      urlData[param] = arg;
      return urlData;
    }, {});

    // Pull request data and options (headers, auth) from args.
    const dataFromArgs = getDataFromArgs(args);
    const isFormData = dataFromArgs instanceof FormData;
    let data;
    if (!isFormData) {
      data = Object.assign({}, dataFromArgs);
    } else {
      data = dataFromArgs;
    }
    const options = getOptionsFromArgs(args);
    const host = options.host || spec.host;

    // Validate that there are no more args.
    if (args.filter((x) => x != null).length) {
      throw new Error(
        `Safepay: Unknown arguments (${args}) (on API request to ${requestMethod} \`${path}\`)`
      );
    }

    // When using full path, we can just invoke the URL interpolator directly
    // as we don't need to use the resource to create a full path.
    const requestPath = isUsingFullPath
      ? commandPath(urlData)
      : this.createFullPath(commandPath, urlData);

    const headers = Object.assign(options.headers, spec.headers);

    const dataInQuery = spec.method === "GET" || spec.method === "DELETE";
    const bodyData = dataInQuery ? undefined : data;
    const queryData = dataInQuery ? data : {};

    return {
      requestMethod,
      requestPath,
      bodyData,
      queryData,
      auth: options.auth,
      headers,
      host: host ?? null,
      settings: options.settings,
    };
  },

  _makeRequest(requestArgs: RequestArgs, spec: MethodSpec): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let opts: RequestOpts;
      try {
        opts = this._getRequestOpts(requestArgs, spec);
      } catch (err) {
        reject(err);
        return;
      }

      function requestCallback(
        err: any,
        response: HttpClientResponseInterface
      ): void {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      }

      const { headers, settings } = opts;

      return this._safepay._requestSender._request(
        opts.requestMethod,
        opts.host,
        opts.requestPath,
        opts.bodyData,
        opts.auth,
        { headers, settings },
        requestCallback
      );
    });
  },
} as SafepayResourceObject;

export { SafepayResource };
