import { useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteSetup, useInfiniteAux } from "../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../types";

import type {
  UseInfiniteRetrieveOptions,
  UseInfiniteRetrieveResult,
} from "./types";

const HOOK_NAME = "useInfiniteRetrieve";

export const useInfiniteRetrieve = <
  TResponse = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseInfiniteRetrieveOptions<TResponse, TParams, TError>
): UseInfiniteRetrieveResult<TResponse, TError> => {
  const {
    axios,
    reactQuery,
    itemsPerPage,
    limitParam,
    offsetParam,
    initialPageParam: initialPageParamCfg,
    lookup,
    sendZeroOffset,
    ...consumerConfig
  } = config;

  const {
    consumer: rest,
    limit,
    initialPageParam,
    safeUrl,
  } = useInfiniteSetup(
    HOOK_NAME,
    url,
    consumerConfig,
    itemsPerPage,
    initialPageParamCfg,
    config
  );

  const infiniteQuery = useInfiniteQuery({
    ...reactQuery,

    initialPageParam,
    queryKey: [...reactQuery.queryKey, limit],

    queryFn: ({ pageParam }) =>
      rest
        .instance<TResponse, AxiosResponse<TResponse, void>, void>(safeUrl, {
          ...axios,
          method: "get",

          params: {
            ...axios?.params,
            [limitParam || rest.paginator.limitParam]: limit,

            ...(((sendZeroOffset &&
              typeof pageParam === "number" &&
              pageParam) ||
              (!sendZeroOffset && pageParam)) && {
              [offsetParam || rest.paginator.offsetParam]: pageParam,
            }),
          },
        })
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
