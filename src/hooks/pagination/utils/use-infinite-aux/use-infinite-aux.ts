import { useEffect, useState, useRef } from "react";

import type { InfiniteData } from "@tanstack/react-query";

import type {
  RichResponse,
  InfiniteConfig,
  InfiniteAttributes,
} from "../../../../types";

export type UseInfiniteAuxResult = InfiniteAttributes;

export const useInfiniteAux = <TResponse>(
  data: InfiniteData<RichResponse<TResponse>, unknown> | undefined,
  { results, total }: InfiniteConfig<TResponse>["lookup"]
): UseInfiniteAuxResult => {
  const [totalOutput, setTotalOutput] = useState<UseInfiniteAuxResult["total"]>(
    { records: 0, fetched: 0 }
  );

  const resultsLookupCb = useRef(results);
  const totalLookupCb = useRef(total);

  useEffect(() => {
    if (!data?.pages) {
      return;
    }

    let totalFetched = 0;
    const lastResponse = data.pages[data.pages.length - 1].response;

    // Check if "total" is a number
    const totalLookup =
      typeof totalLookupCb.current === "function"
        ? totalLookupCb.current(lastResponse)
        : totalLookupCb.current;

    let totalRecords = totalLookup;

    if (typeof totalRecords !== "number") {
      totalRecords = Number(totalLookup);

      if (isNaN(totalRecords)) {
        throw new Error(
          '"total" lookup leads to no "number" or numeric string'
        );
      }
    }

    // Check if "results" is an array
    const resultsLookupPath =
      typeof resultsLookupCb.current === "function"
        ? resultsLookupCb.current(lastResponse)
        : resultsLookupCb.current;

    if (!Array.isArray(lastResponse[resultsLookupPath])) {
      throw new Error('"results" lookup leads to no "Array"');
    }

    for (const { response } of data.pages) {
      const results = response[resultsLookupPath];
      totalFetched += (results as unknown[]).length;
    }

    setTotalOutput({ records: totalRecords, fetched: totalFetched });
  }, [data?.pages]);

  return { total: totalOutput };
};
