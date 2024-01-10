import { useContext, createContext, type ReactNode } from "react";

import type { AxiosInstance } from "axios";
import type { RequiredDeep } from "type-fest";
import type { PaginationParams } from "./types/pagination/pagination";

const defaultPaginationParams: Readonly<RequiredDeep<PaginationParams>> = {
  itemsPerPage: 10,
  limitParam: "limit",
  offsetParam: "offset",
  sendZeroOffset: false,
  initialPageParam: 0,
};

export interface ConsumerConfig {
  paginator?: PaginationParams;
}

export class Consumer {
  readonly instance: AxiosInstance;
  readonly config: Readonly<RequiredDeep<ConsumerConfig>>;

  constructor(instance: AxiosInstance, { paginator }: ConsumerConfig = {}) {
    this.instance = instance;
    this.config = { paginator: { ...defaultPaginationParams, ...paginator } };
  }
}

interface ConsumerProviderProps {
  children?: ReactNode;
  consumer: Consumer;
}

const ConsumerContext = createContext<Consumer | undefined>(undefined);

export const useConsumer = (): Consumer => {
  const ctxConsumer = useContext(ConsumerContext);

  if (!ctxConsumer) {
    throw new Error("No Consumer set, use ConsumerProvider to set one");
  }

  return ctxConsumer;
};

export const ConsumerProvider = ({
  consumer,
  children,
}: ConsumerProviderProps): JSX.Element => {
  return (
    <ConsumerContext.Provider value={consumer}>
      {children}
    </ConsumerContext.Provider>
  );
};
