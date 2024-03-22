import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  FlexibleConsumerConfig,
  FunctionlessUseMutationOptions,
  RichResponse,
  Methodless,
  DatalessAxiosRequestConfig,
} from "../../../types";

export type Payload = void;
export type HookException<TError> = AxiosError<TError, Payload>;

export interface UseDestroyOptions<TResponse, TParams, TError>
  extends FlexibleConsumerConfig {
  reactQuery: FunctionlessUseMutationOptions<
    RichResponse<TResponse>,
    HookException<TError>,
    Payload
  >;

  axios?: Methodless<DatalessAxiosRequestConfig<TParams>>;
}

export type UseDestroyResult<TResponse, TError> = UseMutationResult<
  RichResponse<TResponse>,
  HookException<TError>,
  Payload
>;
