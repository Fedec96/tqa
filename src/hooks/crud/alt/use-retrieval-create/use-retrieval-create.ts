import { useQuery } from "@tanstack/react-query";
import { useFlexibleConsumer } from "../../../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../../types";

import type {
  UseRetrievalCreateOptions,
  UseRetrievalCreateResult,
} from "./types";

export const useRetrievalCreate = <
  TResponse = unknown,
  TPayload = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseRetrievalCreateOptions<TResponse, TPayload, TParams, TError>
): UseRetrievalCreateResult<TResponse, TPayload, TError> => {
  const { axios, reactQuery, ...consumerConfig } = config;
  const rest = useFlexibleConsumer(consumerConfig);

  return useQuery({
    ...reactQuery,

    queryFn: () =>
      rest
        .instance<TResponse, AxiosResponse<TResponse, TPayload>, TPayload>(
          String(url),
          { ...axios, method: "post" }
        )
        .then(({ data: response, status, statusText, headers }) => ({
          response,
          status,
          statusText,
          headers,
        })),
  });
};
