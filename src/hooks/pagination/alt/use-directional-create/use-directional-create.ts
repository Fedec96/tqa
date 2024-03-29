import { useQuery } from "@tanstack/react-query";
import { safeUrl } from "../../../../lib/misc";
import { useDirectionalSetup, useDirectionalAux } from "../../utils";

import type { AxiosResponse } from "axios";
import type { Endpoint } from "../../../../types";

import {
  UseDirectionalCreateOptions,
  UseDirectionalCreateResult,
  DirectionalCreateException,
} from "./types";

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
    hasPreviousPage,
    hasNextPage,
    getPreviousOffset,
    getNextOffset,
    getIntervalFrom,
    getIntervalTo,
    consumer,
  } = config;

  const {
    consumer: rest,
    limit,
    offset,
    setOffset,
  } = useDirectionalSetup(consumer);

  const query = useQuery({
    ...reactQuery,
    queryKey: [...reactQuery.queryKey, limit, offset],

    queryFn: () =>
      rest
        .instance<TResponse, AxiosResponse<TResponse, TPayload>, TPayload>(
          safeUrl(url),
          {
            ...axios,
            method: "post",

            data: {
              ...(axios?.data as TPayload),
              [rest.config.paginator.limitParam]: limit,

              ...((rest.config.paginator.sendZeroOffset ||
                (!rest.config.paginator.sendZeroOffset && offset)) && {
                [rest.config.paginator.offsetParam]: offset,
              }),
            },
          }
        )
        .then(({ data: response, status, statusText, headers }) => ({
          response,
          status,
          statusText,
          headers,
        }))
        .catch((err: DirectionalCreateException<TError, TPayload>) => {
          throw err;
        }),
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
