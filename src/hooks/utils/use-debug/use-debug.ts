import { useEffect } from "react";

import type { Endpoint } from "../../../types";
import type { UseDebugResult } from "./types";

export const useDebug = (
  hookName: string,
  enable: boolean | undefined,
  url: Endpoint,
  safeUrl: string,
  config: unknown
): UseDebugResult =>
  useEffect(() => {
    if (!enable) {
      return;
    }

    console.info(`${new Date().toLocaleString()} - ${hookName}`);
    console.log({ url, safeUrl, config });
  }, [enable, hookName, url, safeUrl, config]);
