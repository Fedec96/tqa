import { useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteSetup, useInfiniteAux } from "../../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../../types";

import type {
  UseInfiniteCreateOptions,
  UseInfiniteCreateResult,
} from "./types";

export const useInfiniteCreate = <
  TResponse = unknown,
  TPayload = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseInfiniteCreateOptions<TResponse, TPayload, TParams, TError>
): UseInfiniteCreateResult<TResponse, TPayload, TError> => {
  const { axios, reactQuery, lookup, consumer } = config;

  const {
    consumer: rest,
    limit,
    initialPageParam,
    safeUrl,
  } = useInfiniteSetup(url, consumer);

  const infiniteQuery = useInfiniteQuery({
    ...reactQuery,

    initialPageParam,
    queryKey: [...reactQuery.queryKey, limit],

    queryFn: ({ pageParam }) =>
      rest
        .instance<TResponse, AxiosResponse<TResponse, TPayload>, TPayload>(
          safeUrl,
          {
            ...axios,
            method: "post",

            data: {
              ...(axios?.data as TPayload),
              [rest.config.paginator.limitParam]: limit,

              ...(((rest.config.paginator.sendZeroOffset &&
                typeof pageParam === "number" &&
                pageParam) ||
                (!rest.config.paginator.sendZeroOffset && pageParam)) && {
                [rest.config.paginator.offsetParam]: pageParam,
              }),
            },
          }
        )
        .then(({ data: response, status, statusText, headers }) => ({
          response,
          status,
          statusText,
          headers,
        })),
  });

  const aux = useInfiniteAux<TResponse>(infiniteQuery.data, lookup);

  return { ...infiniteQuery, ...aux };
};
