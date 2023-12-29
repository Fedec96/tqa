import { useQuery } from "@tanstack/react-query";
import { useFlexibleConsumer, useRestSetup } from "../../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../types";

import type {
  PassiveRequest,
  UseRetrieveOptions,
  UseRetrieveResult,
} from "./types";

const HOOK_NAME = "useRetrieve";

export const useRetrieve = <
  TRequest extends PassiveRequest,
  TResponse = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseRetrieveOptions<TRequest, TResponse, TParams, TError>
): UseRetrieveResult<TResponse, TError> => {
  const { axios, reactQuery, ...consumerConfig } = config;
  const rest = useFlexibleConsumer(consumerConfig);
  const { safeUrl } = useRestSetup(HOOK_NAME, rest.debug, url, config);

  return useQuery({
    ...reactQuery,

    queryFn: () =>
      rest
        .instance<TResponse, AxiosResponse<TResponse, void>, void>(
          safeUrl,
          axios
        )
        .then(({ data: response, status, statusText, headers }) => ({
          response,
          status,
          statusText,
          headers,
        })),
  });
};
