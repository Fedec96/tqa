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
  url: Endpoint,
  consumerConfig: FlexibleConsumerConfig,
  itemsPerPage: Limit | undefined,
  initialPageParam: PageParam | undefined
): UseInfiniteSetupResult => {
  const consumer = useFlexibleConsumer(consumerConfig);
  const [limit] = useState(itemsPerPage ?? consumer.paginator.itemsPerPage);
  const setup = useRestSetup(url);

  return {
    consumer,
    limit,

    initialPageParam:
      initialPageParam ?? consumer.paginator.initialPageParam ?? 0,

    ...setup,
  };
};
