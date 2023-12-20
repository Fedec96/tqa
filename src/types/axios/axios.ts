import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from "axios";

import type { DeepPartial } from "../misc/misc";

type Params = Record<string, unknown>;

export interface AnylessAxiosRequestConfig<TResponse, TParams>
  extends AxiosRequestConfig<TResponse> {
  params?: DeepPartial<TParams & Params>;
}

export type DatalessAxiosRequestConfig<TParams> = Omit<
  AnylessAxiosRequestConfig<void, TParams>,
  "data"
>;

interface ExternalGenericConsumer {
  external: boolean;
}

interface ExternalCustomConsumer {
  instance: AxiosInstance;
}

export interface FlexibleConsumerConfig {
  consumer?: ExternalGenericConsumer | ExternalCustomConsumer;
}

export interface RichResponse<TResponse> {
  response: TResponse;
  headers: AxiosResponseHeaders | RawAxiosResponseHeaders;
  status: number;
  statusText: string;
}
