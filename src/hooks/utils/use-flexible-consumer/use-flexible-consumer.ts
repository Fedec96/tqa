import axios from "axios";
import { useConsumer, Consumer } from "../../..";

import type { UseFlexibleConsumerOptions } from "./types";

export const useFlexibleConsumer = ({
  consumer,
}: UseFlexibleConsumerOptions): Consumer => {
  const ctxConsumer = useConsumer();

  if (consumer) {
    if ("instance" in consumer && consumer.instance) {
      return new Consumer(consumer.instance, consumer.options);
    }

    if ("external" in consumer && consumer.external) {
      return new Consumer(axios.create(), consumer.options);
    }
  }

  if (consumer?.options) {
    return new Consumer(ctxConsumer.instance, consumer.options);
  }

  return ctxConsumer;
};
