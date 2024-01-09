import { useMutation } from "@tanstack/react-query";
import { useFlexibleConsumer, useSafeUrl } from "../../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../types";
import type { UseDestroyOptions, UseDestroyResult } from "./types";

export const useDestroy = <
  TResponse = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseDestroyOptions<TResponse, TParams, TError>
): UseDestroyResult<TResponse, TError> => {
  const { axios, reactQuery, ...consumerConfig } = config;
  const rest = useFlexibleConsumer(consumerConfig);
  const safeUrl = useSafeUrl(url);

  return useMutation({
    ...reactQuery,

    mutationFn: () =>
      rest
        .instance<TResponse, AxiosResponse<TResponse, void>, void>(safeUrl, {
          ...axios,
          method: "delete",
        })
        .then(({ data: response, status, statusText, headers }) => ({
          response,
          status,
          statusText,
          headers,
        })),
  });
};
