import { useQuery } from "@tanstack/react-query";
import { useDirectionalSetup, useDirectionalAux } from "../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../types";

import {
  UseDirectionalRetrieveOptions,
  UseDirectionalRetrieveResult,
} from "./types";

const HOOK_NAME = "useDirectionalRetrieve";

export const useDirectionalRetrieve = <
  TResponse = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseDirectionalRetrieveOptions<TResponse, TParams, TError>
): UseDirectionalRetrieveResult<TResponse, TError> => {
  const {
    axios,
    reactQuery,
    itemsPerPage,
    limitParam,
    offsetParam,
    initialPageParam,
    hasPreviousPage,
    hasNextPage,
    getPreviousOffset,
    getNextOffset,
    getIntervalFrom,
    getIntervalTo,
    sendZeroOffset,
    ...consumerConfig
  } = config;

  const {
    consumer: rest,
    limit,
    offset,
    setOffset,
    safeUrl,
  } = useDirectionalSetup(
    HOOK_NAME,
    url,
    consumerConfig,
    itemsPerPage,
    initialPageParam,
    config
  );

  const query = useQuery({
    ...reactQuery,
    queryKey: [...reactQuery.queryKey, limit, offset],

    queryFn: () =>
      rest
        .instance<TResponse, AxiosResponse<TResponse, void>, void>(safeUrl, {
          ...axios,
          method: "get",

          params: {
            ...axios?.params,
            [limitParam || rest.paginator.limitParam]: limit,

            ...((sendZeroOffset || (!sendZeroOffset && offset)) && {
              [offsetParam || rest.paginator.offsetParam]: offset,
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

  const aux = useDirectionalAux<TResponse>(
    query.data,
    query.isFetching,
    limit,
    offset,
    hasPreviousPage,
    hasNextPage,
    getPreviousOffset,
    getNextOffset,
    setOffset,
    getIntervalFrom,
    getIntervalTo
  );

  return { ...query, ...aux };
};

useDirectionalRetrieve.name = HOOK_NAME;
