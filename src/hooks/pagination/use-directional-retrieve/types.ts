import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  RichResponse,
  BasePaginatorConfig,
  FlexibleConsumerConfig,
  FunctionlessUseQueryOptions,
  FlexibleIntervalConfig,
  OffsetConfig,
  DirectionalFactoryKeys,
  DirectionalControls,
  DirectionalAttributes,
} from "../../../types";

export type Payload = void;
export type HookException<TError> = AxiosError<TError, Payload>;

export type UseDirectionalRetrieveOptions<TResponse, TParams, TError> =
  BasePaginatorConfig<TParams> &
    FlexibleConsumerConfig &
    FlexibleIntervalConfig<TResponse> &
    OffsetConfig<TResponse> &
    DirectionalControls<TResponse> & {
      reactQuery: FunctionlessUseQueryOptions<
        RichResponse<TResponse>,
        HookException<TError>
      >;
    };

export type UseDirectionalRetrieveFactory<TResponse, TParams, TError> = Omit<
  UseDirectionalRetrieveOptions<TResponse, TParams, TError>,
  DirectionalFactoryKeys<TResponse>
>;

export type UseDirectionalRetrieveResult<TResponse, TError> = UseQueryResult<
  RichResponse<TResponse>,
  HookException<TError>
> &
  DirectionalAttributes;
