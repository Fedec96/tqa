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

export type DirectionalRetrievePayload = void;

export type DirectionalRetrieveException<TError> = AxiosError<
  TError,
  DirectionalRetrievePayload
>;

export type UseDirectionalRetrieveOptions<TResponse, TParams, TError> =
  BasePaginatorConfig<TParams> &
    FlexibleConsumerConfig &
    FlexibleIntervalConfig<TResponse> &
    OffsetConfig<TResponse> &
    DirectionalControls<TResponse> & {
      reactQuery: FunctionlessUseQueryOptions<
        RichResponse<TResponse>,
        DirectionalRetrieveException<TError>
      >;
    };

export type UseDirectionalRetrieveFactory<TResponse, TParams, TError> = Omit<
  UseDirectionalRetrieveOptions<TResponse, TParams, TError>,
  DirectionalFactoryKeys<TResponse>
>;

export type UseDirectionalRetrieveResult<TResponse, TError> = UseQueryResult<
  RichResponse<TResponse>,
  DirectionalRetrieveException<TError>
> &
  DirectionalAttributes;
