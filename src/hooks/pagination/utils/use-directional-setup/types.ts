import type { Dispatch, SetStateAction } from "react";

import type { Consumer } from "../../../..";
import type { Limit, Offset } from "../../../../types";

export interface UseDirectionalSetupResult {
  consumer: Consumer;
  limit: Limit;
  offset: Offset;
  setOffset: Dispatch<SetStateAction<Offset>>;
}
