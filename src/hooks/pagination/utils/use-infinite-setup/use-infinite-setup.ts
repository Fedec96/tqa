import { useState } from "react";
import { useFlexibleConsumer, useSafeUrl } from "../../../utils";

import type { Endpoint, FlexibleConsumerConfig } from "../../../../types";
import type { UseInfiniteSetupResult } from "./types";

export const useInfiniteSetup = (
  url: Endpoint,
  consumerConfig: FlexibleConsumerConfig["consumer"]
): UseInfiniteSetupResult => {
  const consumer = useFlexibleConsumer(consumerConfig);
  const [limit] = useState(consumer.config.paginator.itemsPerPage);
  const safeUrl = useSafeUrl(url);

  return {
    consumer,
    limit,
    safeUrl,
    initialPageParam: consumer.config.paginator.initialPageParam,
  };
};
