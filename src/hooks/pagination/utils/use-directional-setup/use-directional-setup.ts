import { useState } from "react";
import { useFlexibleConsumer } from "../../../utils";

import type { FlexibleConsumerConfig } from "../../../../types";
import type { UseDirectionalSetupResult } from "./types";

export const useDirectionalSetup = (
  consumerConfig: FlexibleConsumerConfig["consumer"]
): UseDirectionalSetupResult => {
  const consumer = useFlexibleConsumer(consumerConfig);
  const [limit] = useState(consumer.config.paginator.itemsPerPage);

  const [offset, setOffset] = useState(
    consumer.config.paginator.initialPageParam
  );

  return { consumer, limit, offset, setOffset };
};
