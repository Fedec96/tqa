import { useQuery } from "@tanstack/react-query";
import { safeUrl } from "../../../lib/misc";
import { useFlexibleConsumer } from "../../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../types";

import type {
  PassiveRequest,
  UseRetrieveOptions,
  UseRetrieveResult,
  RetrieveException,
  RetrievePayload,
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
        .instance<
          TResponse,
          AxiosResponse<TResponse, RetrievePayload>,
          RetrievePayload
        >(safeUrl(url), axios)
        .then(({ data: response, status, statusText, headers }) => ({
          response,
          status,
          statusText,
          headers,
        }))
        .catch((err: RetrieveException<TError>) => {
          throw err;
        }),
  });
};
