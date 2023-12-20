import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  FlexibleConsumerConfig,
  FunctionlessUseMutationOptions,
  RichResponse,
  DatalessAxiosRequestConfig,
} from "../../../types";

export interface UseDestroyOptions<TResponse, TParams, TError>
  extends FlexibleConsumerConfig {
  reactQuery: FunctionlessUseMutationOptions<
    RichResponse<TResponse>,
    AxiosError<TError, void>,
    void
  >;

  axios?: Omit<DatalessAxiosRequestConfig<TParams>, "method">;
}

export type UseDestroyResult<TResponse, TError> = UseMutationResult<
  RichResponse<TResponse>,
  AxiosError<TError, void>,
  void
>;
