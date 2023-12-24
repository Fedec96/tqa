import { useMutation } from "@tanstack/react-query";
import { useFlexibleConsumer } from "../../utils";

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
  const { axios, reactQuery, consumer } = config;
  const rest = useFlexibleConsumer(consumer);

  return useMutation({
    ...reactQuery,

    mutationFn: () =>
      rest
        .instance<TResponse, AxiosResponse<TResponse, void>, void>(
          String(url),
          { ...axios, method: "delete" }
        )
        .then(({ data: response, status, statusText, headers }) => ({
          response,
          status,
          statusText,
          headers,
        })),
  });
};
