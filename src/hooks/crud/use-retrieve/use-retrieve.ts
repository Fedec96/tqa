import { useQuery } from "@tanstack/react-query";
import { useFlexibleConsumer } from "../../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../types";

import type {
  PassiveRequest,
  UseRetrieveOptions,
  UseRetrieveResult,
} from "./types";

export const useRetrieve = <
  TRequest extends PassiveRequest,
  TResponse = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseRetrieveOptions<TRequest, TResponse, TParams, TError>
): UseRetrieveResult<TResponse, TError> => {
  const { axios, reactQuery, consumer } = config;
  const rest = useFlexibleConsumer(consumer);

  return useQuery({
    ...reactQuery,

    queryFn: () =>
      rest
        .instance<TResponse, AxiosResponse<TResponse, void>, void>(
          String(url),
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
