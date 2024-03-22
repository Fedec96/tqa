import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  FlexibleConsumerConfig,
  FunctionlessUseMutationOptions,
  RichResponse,
  Methodless,
  DatalessAxiosRequestConfig,
} from "../../../types";

export type DestroyPayload = void;
export type DestroyException<TError> = AxiosError<TError, DestroyPayload>;

export interface UseDestroyOptions<TResponse, TParams, TError>
  extends FlexibleConsumerConfig {
  reactQuery: FunctionlessUseMutationOptions<
    RichResponse<TResponse>,
    DestroyException<TError>,
    DestroyPayload
  >;

  axios?: Methodless<DatalessAxiosRequestConfig<TParams>>;
}

export type UseDestroyResult<TResponse, TError> = UseMutationResult<
  RichResponse<TResponse>,
  DestroyException<TError>,
  DestroyPayload
>;
