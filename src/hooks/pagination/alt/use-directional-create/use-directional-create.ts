import { useQuery } from "@tanstack/react-query";
import { useDirectionalSetup, useDirectionalAux } from "../../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../../types";

import {
  UseDirectionalCreateOptions,
  UseDirectionalCreateResult,
} from "./types";

const HOOK_NAME = "useDirectionalCreate";

export const useDirectionalCreate = <
  TResponse = unknown,
  TPayload = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseDirectionalCreateOptions<TResponse, TPayload, TParams, TError>
): UseDirectionalCreateResult<TResponse, TPayload, TError> => {
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
        .instance<TResponse, AxiosResponse<TResponse, TPayload>, TPayload>(
          safeUrl,
          {
            ...axios,
            method: "post",

            data: {
              ...(axios?.data as TPayload),
              [limitParam || rest.paginator.limitParam]: limit,

              ...((sendZeroOffset || (!sendZeroOffset && offset)) && {
                [offsetParam || rest.paginator.offsetParam]: offset,
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
