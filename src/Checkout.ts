import {
  CreateCheckoutUrlFunction,
  CreateCheckoutUrlParams,
  Env,
} from "./types";

const hostUrls: Record<Env, string> = {
  development: "https://dev.api.getsafepay.com/embedded/",
  sandbox: "https://sandbox.api.getsafepay.com/embedded/",
  production: "https://getsafepay.com/embedded/",
};

const buildQueryParams = (params: Record<string, any>): string =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

export function createCheckout(): {
  createCheckoutUrl: CreateCheckoutUrlFunction;
} {
  return {
    createCheckoutUrl: ({
      env,
      ...params
    }: CreateCheckoutUrlParams): string => {
      const baseUrl = hostUrls[env];
      const queryParams = buildQueryParams({ environment: env, ...params });
      return `${baseUrl}?${queryParams}`;
    },
  };
}
