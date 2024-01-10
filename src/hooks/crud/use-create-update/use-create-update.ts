import { useMutation } from "@tanstack/react-query";
import { useFlexibleConsumer, useSafeUrl } from "../../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../types";

import type {
  ActiveRequest,
  PayloadGuard,
  UseCreateUpdateOptions,
  UseCreateUpdateResult,
} from "./types";

export const useCreateUpdate = <
  TRequest extends ActiveRequest,
  TResponse = unknown,
  TPayload = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseCreateUpdateOptions<TRequest, TResponse, TPayload, TParams, TError>
): UseCreateUpdateResult<TRequest, TResponse, TError, TPayload> => {
  const { axios, reactQuery, consumer } = config;
  const rest = useFlexibleConsumer(consumer);
  const safeUrl = useSafeUrl(url);

  return useMutation({
    ...reactQuery,

    mutationFn: (data) =>
      rest
        .instance<
          TResponse,
          AxiosResponse<TResponse, PayloadGuard<TRequest, TPayload>>,
          PayloadGuard<TRequest, TPayload>
        >(safeUrl, { ...axios, data })
        .then(({ data: response, status, statusText, headers }) => ({
          response,
          status,
          statusText,
          headers,
        })),
  });
};
