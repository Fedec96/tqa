import type {
  UseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";

import type { AxiosError } from "axios";

import type {
  BasePaginatorConfig,
  FlexibleConsumerConfig,
  FunctionlessUseInfiniteQueryOptions,
  RichResponse,
  InfiniteConfig,
  InfiniteAttributes,
  InfiniteFactoryKeys,
  RootInfiniteFactoryKeys,
} from "../../../types";

export type InfiniteRetrievePayload = void;

export type InfiniteRetrieveException<TError> =
  | Error
  | AxiosError<TError, InfiniteRetrievePayload>;

export interface UseInfiniteRetrieveOptions<TResponse, TParams, TError>
  extends BasePaginatorConfig<TParams>,
    FlexibleConsumerConfig,
    InfiniteConfig<TResponse> {
  reactQuery: FunctionlessUseInfiniteQueryOptions<
    RichResponse<TResponse>,
    InfiniteRetrieveException<TError>
  >;
}

export interface UseInfiniteRetrieveFactory<TResponse, TParams, TError>
  extends Omit<
    UseInfiniteRetrieveOptions<TResponse, TParams, TError>,
    RootInfiniteFactoryKeys<TResponse>
  > {
  reactQuery: Omit<
    UseInfiniteRetrieveOptions<TResponse, TParams, TError>["reactQuery"],
    InfiniteFactoryKeys
  >;
}

export type UseInfiniteRetrieveResult<TResponse, TError> =
  UseInfiniteQueryResult<
    InfiniteData<RichResponse<TResponse>>,
    InfiniteRetrieveException<TError>
  > &
    InfiniteAttributes;
