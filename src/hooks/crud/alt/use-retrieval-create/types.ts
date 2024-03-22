import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  RichResponse,
  Methodless,
  FlexibleConsumerConfig,
  FunctionlessUseQueryOptions,
  AnylessAxiosRequestConfig,
} from "../../../../types";

export type HookException<TError, TPayload> = AxiosError<TError, TPayload>;

export interface UseRetrievalCreateOptions<TResponse, TPayload, TParams, TError>
  extends FlexibleConsumerConfig {
  reactQuery: FunctionlessUseQueryOptions<
    RichResponse<TResponse>,
    HookException<TError, TPayload>
  >;

  axios?: Methodless<AnylessAxiosRequestConfig<TPayload, TParams>>;
}

export type UseRetrievalCreateResult<TResponse, TPayload, TError> =
  UseQueryResult<RichResponse<TResponse>, HookException<TError, TPayload>>;
