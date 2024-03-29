import type { PartialDeep } from "type-fest";
import type { ConsumerConfig } from "../..";

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

interface BaseConsumer {
  options?: ConsumerConfig;
  mergeOptions?: boolean;
}

interface ExternalGenericConsumer {
  external?: boolean;
}

interface ExternalCustomConsumer {
  instance?: AxiosInstance;
}

export interface FlexibleConsumerConfig {
  consumer?: (ExternalGenericConsumer | ExternalCustomConsumer) & BaseConsumer;
}

export interface RichResponse<TResponse> {
  response: TResponse;
  headers: AxiosResponseHeaders | RawAxiosResponseHeaders;
  status: number;
  statusText: string;
}

export type Methodless<T> = Omit<T, "method">;
