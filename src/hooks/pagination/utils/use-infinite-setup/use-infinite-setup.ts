import { useState } from "react";
import { useFlexibleConsumer } from "../../../utils";

import type { FlexibleConsumerConfig } from "../../../../types";
import type { UseInfiniteSetupResult } from "./types";

export const useInfiniteSetup = (
  consumerConfig: FlexibleConsumerConfig["consumer"]
): UseInfiniteSetupResult => {
  const consumer = useFlexibleConsumer(consumerConfig);
  const [limit] = useState(consumer.config.paginator.itemsPerPage);

  return {
    consumer,
    limit,
    initialPageParam: consumer.config.paginator.initialPageParam,
  };
};
