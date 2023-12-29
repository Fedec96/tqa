import { useState, useEffect } from "react";

import type { Endpoint } from "../../../types";
import type { UseSafeUrlResult } from "./types";

const buildAxiosSafeUrl = (url: Endpoint): string => {
  if (typeof url === "string") {
    return url;
  }

  try {
    return String(url);
  } catch {
    const { pathname, search, hash } = url;
    return String(new URL(`${pathname}${search}${hash}`, "http://localhost"));
  }
};

export const useSafeUrl = (url: Endpoint): UseSafeUrlResult => {
  const [endpoint, setEndpoint] = useState(buildAxiosSafeUrl(url));
  useEffect(() => setEndpoint(buildAxiosSafeUrl(url)), [url]);
  return endpoint;
};
