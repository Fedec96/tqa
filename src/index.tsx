import { useContext, createContext, type ReactNode } from "react";

import type { AxiosInstance } from "axios";
import type { PaginationParams } from "./types/pagination/pagination";

const defaultPaginationParams: Readonly<PaginationParams> = {
  itemsPerPage: 10,
  limitParam: "limit",
  offsetParam: "offset",
};

export interface ConsumerConfig {
  paginator?: Partial<PaginationParams>;
}

export class Consumer {
  readonly instance: AxiosInstance;
  readonly paginator: Readonly<PaginationParams>;

  constructor(instance: AxiosInstance, { paginator }: ConsumerConfig = {}) {
    this.instance = instance;
    this.paginator = { ...defaultPaginationParams, ...paginator };
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
