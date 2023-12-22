import type { UseInfiniteQueryOptions } from "@tanstack/react-query";
import type { RequireAllOrNone } from "type-fest";

import type {
  DatalessAxiosRequestConfig,
  AnylessAxiosRequestConfig,
} from "../axios/axios";

export type Limit = number;
export type Offset = number;
export type PageParam = Offset | undefined;

export interface PaginationParams {
  itemsPerPage: Limit;
  limitParam: string;
  offsetParam: string;
  initialPageParam?: PageParam;
}

interface CommonPaginatorConfig {
  sendZeroOffset?: boolean;
}

export interface BasePaginatorConfig<TParams>
  extends Partial<PaginationParams>,
    CommonPaginatorConfig {
  axios?: Omit<DatalessAxiosRequestConfig<TParams>, "method">;
}

export interface AltPaginatorConfig<TPayload, TParams>
  extends Omit<BasePaginatorConfig<TParams>, "axios">,
    CommonPaginatorConfig {
  axios?: Omit<AnylessAxiosRequestConfig<TPayload, TParams>, "method">;
}

type OffsetCalculator<TResponse> = (
  response: TResponse,
  currentLimit: Limit,
  currentOffset: Offset,
  hasPreviousPage: boolean,
  hasNextPage: boolean
) => PageParam;

type PageDeterminator<TResponse> = (
  response: TResponse,
  currentLimit: Limit,
  currentOffset: Offset
) => boolean;

export interface Interval {
  from: number;
  to: number;
}

export type IntervalValue = Interval | undefined;

type IntervalCalculator<TResponse, Key extends keyof Interval> = (
  response: TResponse,
  currentLimit: Limit,
  currentOffset: Offset,
  hasPreviousPage: boolean,
  hasNextPage: boolean
) => Interval[Key];

export interface ConfigurableInterval<TResponse> {
  getIntervalFrom: IntervalCalculator<TResponse, "from">;
  getIntervalTo: IntervalCalculator<TResponse, "to">;
}

export type FlexibleIntervalConfig<TResponse> = RequireAllOrNone<
  ConfigurableInterval<TResponse>,
  keyof ConfigurableInterval<TResponse>
>;

export interface OffsetConfig<TResponse> {
  getPreviousOffset: OffsetCalculator<TResponse>;
  getNextOffset: OffsetCalculator<TResponse>;
}

export interface DirectionalControls<TResponse> {
  hasPreviousPage: PageDeterminator<TResponse>;
  hasNextPage: PageDeterminator<TResponse>;
}

export type DirectionalFactoryKeys<TResponse> =
  | keyof OffsetConfig<TResponse>
  | keyof ConfigurableInterval<TResponse>
  | keyof DirectionalControls<TResponse>;

export interface DirectionalAttributes {
  interval: IntervalValue;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  fetchPreviousPage: () => void;
  fetchNextPage: () => void;
}

export type Total = number;
type LookupCallback<TResponse, TResult> = (response: TResponse) => TResult;

export interface InfiniteConfig<TResponse> {
  lookup: {
    results: LookupCallback<TResponse, unknown[]>;
    total: LookupCallback<TResponse, number>;
  };
}

export interface InfiniteAttributes {
  total: { records: Total; fetched: Total };
}

export type InfiniteFactoryKeys = keyof Pick<
  UseInfiniteQueryOptions,
  "initialPageParam" | "getNextPageParam"
>;

export type RootInfiniteFactoryKeys<TResponse> =
  | keyof InfiniteConfig<TResponse>
  | "reactQuery";
