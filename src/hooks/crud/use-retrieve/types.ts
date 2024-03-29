import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosError, Method as BaseMethod } from "axios";

import type {
  RichResponse,
  FlexibleConsumerConfig,
  FunctionlessUseQueryOptions,
  DatalessAxiosRequestConfig,
  Methodless,
} from "../../../types";

export type RetrievePayload = void;

export type RetrieveException<TError> =
  | Error
  | AxiosError<TError, RetrievePayload>;

export type PassiveRequest = "retrieve" | "status";
type Method = Extract<BaseMethod, "get" | "GET" | "head" | "HEAD">;

type MethodGuard<TRequest extends PassiveRequest> = TRequest extends "retrieve"
  ? Extract<Method, "get" | "GET">
  : Extract<Method, "head" | "HEAD">;

export interface UseRetrieveOptions<
  TRequest extends PassiveRequest,
  TResponse,
  TParams,
  TError
> extends FlexibleConsumerConfig {
  reactQuery: FunctionlessUseQueryOptions<
    RichResponse<TResponse>,
    RetrieveException<TError>
  >;

  axios: Methodless<DatalessAxiosRequestConfig<TParams>> & {
    method: MethodGuard<TRequest>;
  };
}

export type UseRetrieveResult<TResponse, TError> = UseQueryResult<
  RichResponse<TResponse>,
  RetrieveException<TError>
>;
