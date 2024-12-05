import { CreateCheckoutUrlFunction, Host } from "./types";

const hostUrls: Record<Host, string> = {
  development: "https://dev.api.getsafepay.com/embedded/",
  sandbox: "https://sandbox.api.getsafepay.com/embedded/",
  production: "https://getsafepay.com/embedded/",
};

const getHost = (host: Host): string => {
  return hostUrls[host];
};

const buildQueryParams = (params: Record<string, any>): string => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};

export const createCheckoutUrl: CreateCheckoutUrlFunction = ({
  host,
  tbt,
  tracker,
  source,
  user_id,
  address,
  order_id,
  is_implicit,
  cancel_url,
  redirect_url,
}) => {
  const baseUrl = getHost(host);

  const queryParams = buildQueryParams({
    environment: host,
    tbt,
    tracker,
    source,
    user_id,
    address,
    order_id,
    is_implicit,
    cancel_url,
    redirect_url,
  });

  return `${baseUrl}?${queryParams}`;
};
