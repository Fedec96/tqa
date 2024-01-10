import { useInfiniteQuery } from "@tanstack/react-query";
import { safeUrl } from "../../../lib/misc";
import { useInfiniteSetup, useInfiniteAux } from "../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../types";

import type {
  UseInfiniteRetrieveOptions,
  UseInfiniteRetrieveResult,
} from "./types";

export const useInfiniteRetrieve = <
  TResponse = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseInfiniteRetrieveOptions<TResponse, TParams, TError>
): UseInfiniteRetrieveResult<TResponse, TError> => {
  const { axios, reactQuery, lookup, consumer } = config;

  const {
    consumer: rest,
    limit,
    initialPageParam,
  } = useInfiniteSetup(consumer);

  const infiniteQuery = useInfiniteQuery({
    ...reactQuery,

    initialPageParam,
    queryKey: [...reactQuery.queryKey, limit],

    queryFn: ({ pageParam }) =>
      rest
        .instance<TResponse, AxiosResponse<TResponse, void>, void>(
          safeUrl(url),
          {
            ...axios,
            method: "get",

            params: {
              ...axios?.params,
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
