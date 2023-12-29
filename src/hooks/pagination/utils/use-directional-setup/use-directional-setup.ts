import { useState } from "react";
import { useFlexibleConsumer, useRestSetup } from "../../../utils";

import type {
  Limit,
  FlexibleConsumerConfig,
  Offset,
  Endpoint,
  PageParam,
} from "../../../../types";

import type { UseDirectionalSetupResult } from "./types";

export const useDirectionalSetup = (
  url: Endpoint,
  consumerConfig: FlexibleConsumerConfig,
  itemsPerPage: Limit | undefined,
  initialPageParam: PageParam
): UseDirectionalSetupResult => {
  const consumer = useFlexibleConsumer(consumerConfig);
  const [limit] = useState(itemsPerPage ?? consumer.paginator.itemsPerPage);
  const setup = useRestSetup(url);

  const [offset, setOffset] = useState<Offset>(
    initialPageParam ?? consumer.paginator.initialPageParam ?? 0
  );

  return { consumer, limit, offset, setOffset, ...setup };
};
