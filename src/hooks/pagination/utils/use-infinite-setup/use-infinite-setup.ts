import { useState } from "react";
import { useFlexibleConsumer, useSafeUrl } from "../../../utils";

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
  const safeUrl = useSafeUrl(url);

  return {
    consumer,
    limit,
    safeUrl,

    initialPageParam:
      initialPageParam ?? consumer.paginator.initialPageParam ?? 0,
  };
};
