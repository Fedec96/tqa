import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError, Method as BaseMethod } from "axios";
import type { PartialDeep } from "type-fest";

import type {
  RichResponse,
  Methodless,
  FlexibleConsumerConfig,
  FunctionlessUseMutationOptions,
  DatalessAxiosRequestConfig,
} from "../../../types";

export type CreateUpdateException<
  TError,
  TRequest extends ActiveRequest,
  TPayload
> = Error | AxiosError<TError, PayloadGuard<TRequest, TPayload>>;

export type ActiveRequest = "create" | "update" | "partialUpdate";

type Method = Extract<
  BaseMethod,
  "post" | "POST" | "put" | "PUT" | "patch" | "PATCH"
>;

type MethodGuard<TRequest extends ActiveRequest> = TRequest extends "create"
  ? Extract<Method, "post" | "POST">
  : TRequest extends "update"
  ? Extract<Method, "put" | "PUT">
  : Extract<Method, "patch" | "PATCH">;

export type PayloadGuard<
  TRequest extends ActiveRequest,
  TPayload
> = TRequest extends "partialUpdate" ? PartialDeep<TPayload> : TPayload;

export interface UseCreateUpdateOptions<
  TRequest extends ActiveRequest,
  TResponse,
  TPayload,
  TParams,
  TError
> extends FlexibleConsumerConfig {
  reactQuery: FunctionlessUseMutationOptions<
    RichResponse<TResponse>,
    CreateUpdateException<TError, TRequest, TPayload>,
    PayloadGuard<TRequest, TPayload>
  >;

  axios: Methodless<DatalessAxiosRequestConfig<TParams>> & {
    method: MethodGuard<TRequest>;
  };
}

export type UseCreateUpdateResult<
  TRequest extends ActiveRequest,
  TResponse,
  TError,
  TPayload
> = UseMutationResult<
  RichResponse<TResponse>,
  CreateUpdateException<TError, TRequest, TPayload>,
  PayloadGuard<TRequest, TPayload>
>;
