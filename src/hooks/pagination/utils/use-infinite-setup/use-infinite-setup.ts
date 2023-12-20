import { useState } from "react";
import { useFlexibleConsumer } from "../../../utils";

import type { Consumer } from "../../../..";
import type {
  Limit,
  Offset,
  PageParam,
  FlexibleConsumerConfig,
} from "../../../../types";

export interface UseInfiniteSetupResult {
  consumer: Consumer;
  limit: Limit;
  initialPageParam: Offset;
}

export const useInfiniteSetup = (
  consumerConfig: FlexibleConsumerConfig["consumer"],
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
