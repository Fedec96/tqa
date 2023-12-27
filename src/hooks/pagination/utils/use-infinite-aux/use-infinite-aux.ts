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

  const resultsLookup = useRef(results);
  const totalLookup = useRef(total);

  useEffect(() => {
    if (!data?.pages) {
      return;
    }

    let totalComputed = false;
    let totalRecords = 0;
    let totalFetched = 0;

    for (const { response } of data.pages) {
      totalFetched += resultsLookup.current(response).length;

      if (!totalComputed) {
        totalComputed = true;
        totalRecords = totalLookup.current(response);
      }
    }

    setTotalOutput({ records: totalRecords, fetched: totalFetched });
  }, [data?.pages]);

  return { total: totalOutput };
};
