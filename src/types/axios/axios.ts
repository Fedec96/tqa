import type { PartialDeep } from "type-fest";

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from "axios";

type Params = Record<string, unknown>;

export interface AnylessAxiosRequestConfig<TPayload, TParams>
  extends AxiosRequestConfig<TPayload> {
  params?: PartialDeep<TParams & Params>;
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
