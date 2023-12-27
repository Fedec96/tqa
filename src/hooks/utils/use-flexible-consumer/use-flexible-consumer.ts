import axios from "axios";
import { useConsumer, Consumer } from "../../..";

import type { UseFlexibleConsumerOptions } from "./types";

export const useFlexibleConsumer = (
  config: UseFlexibleConsumerOptions
): Consumer => {
  const ctxConsumer = useConsumer();

  if (config) {
    const ctxConfig = ctxConsumer.getConfig();

    if ("instance" in config) {
      return new Consumer(config.instance, ctxConfig);
    }

    if (config.external) {
      return new Consumer(axios.create(), ctxConfig);
    }
  }

  return ctxConsumer;
};
