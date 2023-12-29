import { useState } from "react";
import { useFlexibleConsumer } from "../../../utils";

import type {
  Limit,
  PageParam,
  FlexibleConsumerConfig,
} from "../../../../types";

import { UseInfiniteSetupResult } from "./types";

export const useInfiniteSetup = (
  consumerConfig: FlexibleConsumerConfig,
  itemsPerPage: Limit | undefined,
  initialPageParam: PageParam | undefined
): UseInfiniteSetupResult => {
  const consumer = useFlexibleConsumer(consumerConfig);
  const [limit] = useState(itemsPerPage ?? consumer.paginator.itemsPerPage);

  return {
    consumer,
    limit,

    initialPageParam:
      initialPageParam ?? consumer.paginator.initialPageParam ?? 0,
  };
};
