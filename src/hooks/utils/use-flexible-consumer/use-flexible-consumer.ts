import axios from "axios";
import { useConsumer, Consumer } from "../../..";

import type { FlexibleConsumerConfig } from "../../../types";

export type UseFlexibleConsumerOptions = FlexibleConsumerConfig["consumer"];

export const useFlexibleConsumer = (
  config: UseFlexibleConsumerOptions
): Consumer => {
  const ctxConsumer = useConsumer();

  if (config) {
    if ("instance" in config) {
      return new Consumer(config.instance, {
        paginator: ctxConsumer.paginator,
      });
    }

    if (config.external) {
      return new Consumer(axios.create(), { paginator: ctxConsumer.paginator });
    }
  }

  return ctxConsumer;
};
