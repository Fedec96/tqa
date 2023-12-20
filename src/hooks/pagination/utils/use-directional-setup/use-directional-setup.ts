import { useState, type Dispatch, type SetStateAction } from "react";
import { useFlexibleConsumer } from "../../../utils";

import type { Consumer } from "../../../..";

import type {
  Limit,
  FlexibleConsumerConfig,
  Offset,
  PageParam,
} from "../../../../types";

export interface UseDirectionalSetupResult {
  consumer: Consumer;
  limit: Limit;
  offset: Offset;
  setOffset: Dispatch<SetStateAction<Offset>>;
}

export const useDirectionalSetup = (
  consumerConfig: FlexibleConsumerConfig["consumer"],
  itemsPerPage: Limit | undefined,
  initialPageParam: PageParam
): UseDirectionalSetupResult => {
  const consumer = useFlexibleConsumer(consumerConfig);
  const [limit] = useState(itemsPerPage ?? consumer.paginator.itemsPerPage);

  const [offset, setOffset] = useState<Offset>(
    initialPageParam ?? consumer.paginator.initialPageParam ?? 0
  );

  return { consumer, limit, offset, setOffset };
};
