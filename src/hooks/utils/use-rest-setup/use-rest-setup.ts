import { useDebug, useSafeUrl } from "..";

import type { Endpoint } from "../../../types";
import type { UseRestSetupResult } from "./types";

export const useRestSetup = (
  hookName: string,
  enableDebug: boolean | undefined,
  url: Endpoint,
  config: unknown
): UseRestSetupResult => {
  const safeUrl = useSafeUrl(url);

  useDebug(hookName, enableDebug, url, safeUrl, config);

  return { safeUrl };
};
