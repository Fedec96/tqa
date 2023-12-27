import type { Consumer } from "../../../..";
import type { Limit, Offset } from "../../../../types";

export interface UseInfiniteSetupResult {
  consumer: Consumer;
  limit: Limit;
  initialPageParam: Offset;
}
