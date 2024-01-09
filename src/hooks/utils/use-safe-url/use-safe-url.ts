import { useState, useEffect } from "react";

import type { Endpoint } from "../../../types";
import type { UseSafeUrlResult } from "./types";

const __safe = (url: Endpoint): string =>
  typeof url === "string" ? url : String(url);

export const useSafeUrl = (url: Endpoint): UseSafeUrlResult => {
  const [endpoint, setEndpoint] = useState(__safe(url));
  useEffect(() => setEndpoint(__safe(url)), [url]);
  return endpoint;
};
