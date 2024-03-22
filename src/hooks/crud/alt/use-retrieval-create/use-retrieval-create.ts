import { useQuery } from "@tanstack/react-query";
import { safeUrl } from "../../../../lib/misc";
import { useFlexibleConsumer } from "../../../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../../types";

import type {
  UseRetrievalCreateOptions,
  UseRetrievalCreateResult,
  RetrievalCreateException,
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
  const { axios, reactQuery, consumer } = config;
  const rest = useFlexibleConsumer(consumer);

  return useQuery({
    ...reactQuery,

    queryFn: () =>
      rest
        .instance<TResponse, AxiosResponse<TResponse, TPayload>, TPayload>(
          safeUrl(url),
          { ...axios, method: "post" }
        )
        .then(({ data: response, status, statusText, headers }) => ({
          response,
          status,
          statusText,
          headers,
        }))
        .catch((err: RetrievalCreateException<TError, TPayload>) => {
          throw err;
        }),
  });
};
