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
  const {
    axios,
    reactQuery,
    itemsPerPage,
    limitParam,
    offsetParam,
    initialPageParam: initialPageParamCfg,
    consumer,
    lookup,
    sendZeroOffset,
  } = config;

  const {
    consumer: rest,
    limit,
    initialPageParam,
  } = useInfiniteSetup(consumer, itemsPerPage, initialPageParamCfg);

  const infiniteQuery = useInfiniteQuery({
    ...reactQuery,

    initialPageParam,
    queryKey: [...reactQuery.queryKey, limit],

    queryFn: ({ pageParam }) =>
      rest
        .instance<TResponse, AxiosResponse<TResponse, TPayload>, TPayload>(
          String(url),
          {
            ...axios,
            method: "post",

            data: {
              ...(axios?.data as TPayload),
              [limitParam || rest.paginator.limitParam]: limit,

              ...(((sendZeroOffset &&
                typeof pageParam === "number" &&
                pageParam) ||
                (!sendZeroOffset && pageParam)) && {
                [offsetParam || rest.paginator.offsetParam]: pageParam,
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
