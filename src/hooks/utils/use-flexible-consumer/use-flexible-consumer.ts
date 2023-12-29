import axios from "axios";
import { useConsumer, Consumer } from "../../..";

import type { UseFlexibleConsumerOptions } from "./types";

export const useFlexibleConsumer = ({
  consumer,
}: UseFlexibleConsumerOptions): Consumer => {
  const ctxConsumer = useConsumer();

  if (consumer) {
    if ("instance" in consumer) {
      return new Consumer(consumer.instance, consumer.options);
    }

    if (consumer.external) {
      return new Consumer(axios.create(), consumer.options);
    }
  }

  return ctxConsumer;
};
