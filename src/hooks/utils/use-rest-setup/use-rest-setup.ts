import { useSafeUrl } from "..";

import type { Endpoint } from "../../../types";
import type { UseRestSetupResult } from "./types";

export const useRestSetup = (url: Endpoint): UseRestSetupResult => {
  const safeUrl = useSafeUrl(url);
  return { safeUrl };
};
