import type { Endpoint } from "../types";

export const safeUrl = (url: Endpoint): string =>
  typeof url === "string" ? url : String(url);
