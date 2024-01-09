import type { Dispatch, SetStateAction } from "react";

import type { UseSafeUrlResult } from "../../../utils";
import type { Consumer } from "../../../..";
import type { Limit, Offset } from "../../../../types";

export interface UseDirectionalSetupResult {
  consumer: Consumer;
  limit: Limit;
  offset: Offset;
  setOffset: Dispatch<SetStateAction<Offset>>;
  safeUrl: UseSafeUrlResult;
}
