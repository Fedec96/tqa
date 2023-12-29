import { useMutation } from "@tanstack/react-query";
import { useFlexibleConsumer, useRestSetup } from "../../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../types";

import type {
  ActiveRequest,
  PayloadGuard,
  UseCreateUpdateOptions,
  UseCreateUpdateResult,
} from "./types";

const HOOK_NAME = "useCreateUpdate";

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
  const { axios, reactQuery, ...consumerConfig } = config;
  const rest = useFlexibleConsumer(consumerConfig);
  const { safeUrl } = useRestSetup(HOOK_NAME, rest.debug, url, config);

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

useCreateUpdate.name = HOOK_NAME;
