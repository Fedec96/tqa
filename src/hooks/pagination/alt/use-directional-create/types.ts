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

export type DirectionalCreateException<TError, TPayload> =
  | Error
  | AxiosError<TError, TPayload>;

export type UseDirectionalCreateOptions<TResponse, TPayload, TParams, TError> =
  AltPaginatorConfig<TPayload, TParams> &
    FlexibleConsumerConfig &
    FlexibleIntervalConfig<TResponse> &
    OffsetConfig<TResponse> &
    DirectionalControls<TResponse> & {
      reactQuery: FunctionlessUseQueryOptions<
        RichResponse<TResponse>,
        DirectionalCreateException<TError, TPayload>
      >;
    };

export type UseDirectionalCreateFactory<TResponse, TPayload, TParams, TError> =
  Omit<
    UseDirectionalCreateOptions<TResponse, TPayload, TParams, TError>,
    DirectionalFactoryKeys<TResponse>
  >;

export type UseDirectionalCreateResult<TResponse, TPayload, TError> =
  UseQueryResult<
    RichResponse<TResponse>,
    DirectionalCreateException<TError, TPayload>
  > &
    DirectionalAttributes;
