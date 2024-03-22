import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  FlexibleConsumerConfig,
  FunctionlessUseMutationOptions,
  RichResponse,
  Methodless,
  DatalessAxiosRequestConfig,
} from "../../../../types";

export type CreationalRetrievePayload = void;

export type CreationalRetrieveException<TError> = AxiosError<
  TError,
  CreationalRetrievePayload
>;

export interface UseCreationalRetrieveOptions<TResponse, TParams, TError>
  extends FlexibleConsumerConfig {
  reactQuery: FunctionlessUseMutationOptions<
    RichResponse<TResponse>,
    CreationalRetrieveException<TError>,
    CreationalRetrievePayload
  >;

  axios?: Methodless<DatalessAxiosRequestConfig<TParams>>;
}

export type UseCreationalRetrieveResult<TResponse, TError> = UseMutationResult<
  RichResponse<TResponse>,
  CreationalRetrieveException<TError>,
  CreationalRetrievePayload
>;
