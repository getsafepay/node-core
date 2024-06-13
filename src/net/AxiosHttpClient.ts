import axios, { Method, AxiosResponse, AxiosError } from "axios";
import * as qs from "qs";
import { RequestHeaders, RequestData } from "../types.js";
import {
  HttpClient,
  HttpClientResponse,
  HttpClientResponseInterface,
} from "./HttpClient.js";

export class AxiosHttpClient extends HttpClient {
  /** @override. */
  getClientName(): string {
    return "node";
  }

  makeRequest(
    host: string,
    path: string,
    method: string,
    headers: RequestHeaders,
    requestData: RequestData,
    requestParams: RequestData,
    timeout: number
  ): Promise<HttpClientResponseInterface> {
    return axios
      .create()
      .request({
        timeout: timeout,
        method: method,
        url: `${host}${path}`,
        headers: headers,
        data: requestData,
        params: requestParams,
        paramsSerializer: (params: Record<string, any>) => {
          return qs.stringify(params, {
            arrayFormat: "indices",
            encode: false,
          });
        },
      })
      .then((response) => {
        return new AxiosHttpClientResponse(response);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const data = error.response.data;
          // @ts-ignore
          if (data.error) {
            return new AxiosHttpClientResponse({
              status: error.response.status,
              headers: error.response.headers,
              data: {
                // @ts-ignore
                message: data.error,
              },
            });

          // @ts-ignore
          } else if (data.message) {
            return new AxiosHttpClientResponse({
                status: error.response.status,
                headers: error.response.headers,
                data: {
                // @ts-ignore
                message: data.message,
                },
            });
          } else {
            return new AxiosHttpClientResponse({
              status: error.response.status,
              headers: error.response.headers,
              data: {
                // @ts-ignore
                message: data.status.errors.join(", "),
              },
            });
          }
        } else if (error.request) {
          return new AxiosHttpClientResponse({
            status: 500,
            headers: {},
            data: {
              message: "The request was made but no response was received",
            },
          });
        } else {
          return new AxiosHttpClientResponse({
            status: 500,
            headers: {},
            data: {
              message:
                "Something happened in setting up the request that triggered an Error",
            },
          });
        }
      });
  }
}

type Response = Omit<AxiosResponse, "statusText" | "config">;

export class AxiosHttpClientResponse
  extends HttpClientResponse
  implements HttpClientResponseInterface
{
  _res: Response;

  constructor(res: Response) {
    // @ts-ignore
    super(res.status, res.headers || {});
    this._res = res;
  }

  toJSON(): any {
    return new Promise((resolve) => resolve(this._res.data));
  }
}
