import { useMutation } from "@tanstack/react-query";
import { safeUrl } from "../../../../lib/misc";
import { useFlexibleConsumer } from "../../../utils";

import type { AxiosResponse } from "axios";

import type { Endpoint } from "../../../../types";

import type {
  UseCreationalRetrieveOptions,
  UseCreationalRetrieveResult,
  CreationalRetrieveException,
  CreationalRetrievePayload,
} from "./types";

export const useCreationalRetrieve = <
  TResponse = unknown,
  TParams = unknown,
  TError = unknown
>(
  url: Endpoint,
  config: UseCreationalRetrieveOptions<TResponse, TParams, TError>
): UseCreationalRetrieveResult<TResponse, TError> => {
  const { axios, reactQuery, consumer } = config;
  const rest = useFlexibleConsumer(consumer);

  return useMutation({
    ...reactQuery,

    mutationFn: () =>
      rest
        .instance<
          TResponse,
          AxiosResponse<TResponse, CreationalRetrievePayload>,
          CreationalRetrievePayload
        >(safeUrl(url), { ...axios, method: "get" })
        .then(({ data: response, status, statusText, headers }) => ({
          response,
          status,
          statusText,
          headers,
        }))
        .catch((err: CreationalRetrieveException<TError>) => {
          throw err;
        }),
  });
};
