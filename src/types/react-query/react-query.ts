import type {
  UseQueryOptions,
  UseMutationOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
  QueryKey,
  MutationKey,
} from "@tanstack/react-query";

import type { PageParam } from "../pagination/pagination";

interface KeyedQueryOptions<TResponse, TError>
  extends Omit<UseQueryOptions<TResponse, TError>, "queryKey"> {
  queryKey: QueryKey;
}

export type FunctionlessUseQueryOptions<TResponse, TError> = Omit<
  KeyedQueryOptions<TResponse, TError>,
  "queryFn"
>;

interface KeyedUseMutationOptions<TResponse, TError, TPayload>
  extends Omit<UseMutationOptions<TResponse, TError, TPayload>, "mutationKey"> {
  mutationKey: MutationKey;
}

export type FunctionlessUseMutationOptions<TResponse, TError, TPayload> = Omit<
  KeyedUseMutationOptions<TResponse, TError, TPayload>,
  "mutationFn"
>;

export type FunctionlessUseInfiniteQueryOptions<TResponse, TError> = Omit<
  UseInfiniteQueryOptions<
    TResponse,
    TError,
    InfiniteData<TResponse>,
    TResponse,
    QueryKey | MutationKey,
    PageParam
  >,
  "queryFn" | "initialPageParam"
>;
