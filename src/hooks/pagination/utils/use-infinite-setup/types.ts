import type { UseRestSetupResult } from "../../../utils";
import type { Consumer } from "../../../..";
import type { Limit, Offset } from "../../../../types";

export interface UseInfiniteSetupResult extends UseRestSetupResult {
  consumer: Consumer;
  limit: Limit;
  initialPageParam: Offset;
}
