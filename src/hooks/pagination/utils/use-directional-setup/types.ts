import type { Dispatch, SetStateAction } from "react";

import type { UseRestSetupResult } from "../../../utils";
import type { Consumer } from "../../../..";
import type { Limit, Offset } from "../../../../types";

export interface UseDirectionalSetupResult extends UseRestSetupResult {
  consumer: Consumer;
  limit: Limit;
  offset: Offset;
  setOffset: Dispatch<SetStateAction<Offset>>;
}
