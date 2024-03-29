import type {
  UseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";

import type { AxiosError } from "axios";

import type {
  AltPaginatorConfig,
  FlexibleConsumerConfig,
  FunctionlessUseInfiniteQueryOptions,
  RichResponse,
  InfiniteConfig,
  InfiniteAttributes,
  InfiniteFactoryKeys,
  RootInfiniteFactoryKeys,
} from "../../../../types";

export type InfiniteCreateException<TError, TPayload> =
  | Error
  | AxiosError<TError, TPayload>;

export interface UseInfiniteCreateOptions<TResponse, TPayload, TParams, TError>
  extends AltPaginatorConfig<TPayload, TParams>,
    FlexibleConsumerConfig,
    InfiniteConfig<TResponse> {
  reactQuery: FunctionlessUseInfiniteQueryOptions<
    RichResponse<TResponse>,
    InfiniteCreateException<TError, TPayload>
  >;
}

export interface UseInfiniteCreateFactory<TResponse, TPayload, TParams, TError>
  extends Omit<
    UseInfiniteCreateOptions<TResponse, TPayload, TParams, TError>,
    RootInfiniteFactoryKeys<TResponse>
  > {
  reactQuery: Omit<
    UseInfiniteCreateOptions<
      TResponse,
      TPayload,
      TParams,
      TError
    >["reactQuery"],
    InfiniteFactoryKeys
  >;
}

export type UseInfiniteCreateResult<TResponse, TPayload, TError> =
  UseInfiniteQueryResult<
    InfiniteData<RichResponse<TResponse>>,
    InfiniteCreateException<TError, TPayload>
  > &
    InfiniteAttributes;
