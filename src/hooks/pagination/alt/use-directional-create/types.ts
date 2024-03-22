import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  RichResponse,
  AltPaginatorConfig,
  FlexibleConsumerConfig,
  FunctionlessUseQueryOptions,
  FlexibleIntervalConfig,
  OffsetConfig,
  DirectionalFactoryKeys,
  DirectionalControls,
  DirectionalAttributes,
} from "../../../../types";

export type HookException<TError, TPayload> = AxiosError<TError, TPayload>;

export type UseDirectionalCreateOptions<TResponse, TPayload, TParams, TError> =
  AltPaginatorConfig<TPayload, TParams> &
    FlexibleConsumerConfig &
    FlexibleIntervalConfig<TResponse> &
    OffsetConfig<TResponse> &
    DirectionalControls<TResponse> & {
      reactQuery: FunctionlessUseQueryOptions<
        RichResponse<TResponse>,
        HookException<TError, TPayload>
      >;
    };

export type UseDirectionalCreateFactory<TResponse, TPayload, TParams, TError> =
  Omit<
    UseDirectionalCreateOptions<TResponse, TPayload, TParams, TError>,
    DirectionalFactoryKeys<TResponse>
  >;

export type UseDirectionalCreateResult<TResponse, TPayload, TError> =
  UseQueryResult<RichResponse<TResponse>, HookException<TError, TPayload>> &
    DirectionalAttributes;
