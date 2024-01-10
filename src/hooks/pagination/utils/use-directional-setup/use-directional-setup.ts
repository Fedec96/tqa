import { useState } from "react";
import { useFlexibleConsumer, useSafeUrl } from "../../../utils";

import type {
  FlexibleConsumerConfig,
  Offset,
  Endpoint,
} from "../../../../types";

import type { UseDirectionalSetupResult } from "./types";

export const useDirectionalSetup = (
  url: Endpoint,
  consumerConfig: FlexibleConsumerConfig["consumer"]
): UseDirectionalSetupResult => {
  const consumer = useFlexibleConsumer(consumerConfig);
  const safeUrl = useSafeUrl(url);
  const [limit] = useState(consumer.config.paginator.itemsPerPage);

  const [offset, setOffset] = useState<Offset>(
    consumer.config.paginator.initialPageParam
  );

  return { consumer, limit, offset, setOffset, safeUrl };
};
