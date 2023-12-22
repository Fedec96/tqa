import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  DirectionalAttributes,
  DirectionalControls,
  RichResponse,
  ConfigurableInterval,
  IntervalValue,
  Offset,
  OffsetConfig,
  Limit,
} from "../../../../types";

export type UseDirectionalAuxResult = DirectionalAttributes;

export const useDirectionalAux = <TResponse>(
  data: RichResponse<TResponse> | undefined,
  isFetching: boolean,
  limit: Limit,
  offset: Offset,
  hasPreviousPageFn: DirectionalControls<TResponse>["hasPreviousPage"],
  hasNextPageFn: DirectionalControls<TResponse>["hasNextPage"],
  getPreviousOffset: OffsetConfig<TResponse>["getPreviousOffset"],
  getNextOffset: OffsetConfig<TResponse>["getNextOffset"],
  setOffset: Dispatch<SetStateAction<Offset>>,

  getIntervalFrom:
    | ConfigurableInterval<TResponse>["getIntervalFrom"]
    | undefined,

  getIntervalTo: ConfigurableInterval<TResponse>["getIntervalTo"] | undefined
): UseDirectionalAuxResult => {
  const [interval, setInterval] = useState<IntervalValue>(undefined);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const hasPreviousPageCallback = useRef(hasPreviousPageFn);
  const hasNextPageCallback = useRef(hasNextPageFn);
  const getIntervalFromCallback = useRef(getIntervalFrom);
  const getIntervalToCallback = useRef(getIntervalTo);
  const getPreviousOffsetCallback = useRef(getPreviousOffset);
  const getNextOffsetCallback = useRef(getNextOffset);

  useEffect(() => {
    if (!data?.response) {
      return;
    }

    setHasPreviousPage(
      hasPreviousPageCallback.current(data.response, limit, offset)
    );

    setHasNextPage(hasNextPageCallback.current(data.response, limit, offset));
  }, [data?.response, limit, offset]);

  useEffect(() => {
    if (
      !data?.response ||
      isFetching ||
      !getIntervalFromCallback.current ||
      !getIntervalToCallback.current
    ) {
      return;
    }

    const args: Parameters<typeof getIntervalFromCallback.current> = [
      data.response,
      limit,
      offset,
      hasPreviousPage,
      hasNextPage,
    ];

    setInterval({
      from: getIntervalFromCallback.current(...args),
      to: getIntervalToCallback.current(...args),
    });
  }, [data?.response, isFetching, limit, offset, hasPreviousPage, hasNextPage]);

  const navigateFn = (direction: "back" | "forth") => {
    if (
      !data ||
      isFetching ||
      (direction === "back" && !hasPreviousPage) ||
      (direction === "forth" && !hasNextPage)
    ) {
      return;
    }

    const args: Parameters<typeof getPreviousOffsetCallback.current> = [
      data.response,
      limit,
      offset,
      hasPreviousPage,
      hasNextPage,
    ];

    const fn =
      direction === "back"
        ? getPreviousOffsetCallback.current
        : getNextOffsetCallback.current;

    const newOffset = fn(...args);

    if (typeof newOffset === "number") {
      setOffset(newOffset);
    }
  };

  const navigate = useCallback(navigateFn, [
    data,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    setOffset,
    limit,
    offset,
  ]);

  return {
    hasPreviousPage,
    hasNextPage,
    interval,
    fetchPreviousPage: () => navigate("back"),
    fetchNextPage: () => navigate("forth"),
  };
};
