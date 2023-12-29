import { useState } from "react";
import { useFlexibleConsumer, useRestSetup } from "../../../utils";

import type {
  Limit,
  PageParam,
  Endpoint,
  FlexibleConsumerConfig,
} from "../../../../types";

import { UseInfiniteSetupResult } from "./types";

export const useInfiniteSetup = (
  hookName: string,
  url: Endpoint,
  consumerConfig: FlexibleConsumerConfig,
  itemsPerPage: Limit | undefined,
  initialPageParam: PageParam | undefined,
  config: unknown
): UseInfiniteSetupResult => {
  const consumer = useFlexibleConsumer(consumerConfig);
  const [limit] = useState(itemsPerPage ?? consumer.paginator.itemsPerPage);
  const setup = useRestSetup(hookName, consumer.debug, url, config);

  return {
    consumer,
    limit,

    initialPageParam:
      initialPageParam ?? consumer.paginator.initialPageParam ?? 0,

    ...setup,
  };
};
