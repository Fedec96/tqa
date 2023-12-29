import { useMutation } from "@tanstack/react-query";
import { useFlexibleConsumer, useRestSetup } from "../../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../types";
import type { UseDestroyOptions, UseDestroyResult } from "./types";

const HOOK_NAME = "useDestroy";

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
  const { safeUrl } = useRestSetup(HOOK_NAME, rest.debug, url, config);

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

useDestroy.name = HOOK_NAME;
