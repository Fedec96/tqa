import axios from "axios";
import { useConsumer, Consumer, type ConsumerConfig } from "../../..";

import type { FlexibleConsumerConfig } from "../../../types";

export const useFlexibleConsumer = (
  consumer: FlexibleConsumerConfig["consumer"]
): Consumer => {
  const ctxConsumer = useConsumer();

  if (consumer) {
    // Consumer
    let instance = ctxConsumer.instance;

    if ("instance" in consumer && consumer.instance) {
      instance = consumer.instance;
    }

    if ("external" in consumer && consumer.external) {
      instance = axios.create();
    }

    // Options
    let options: ConsumerConfig = {};
    const { options: customOptions, mergeOptions } = consumer;

    if (customOptions && Object.keys(customOptions).length) {
      options = mergeOptions
        ? { ...ctxConsumer.config, ...customOptions }
        : customOptions;
    } else {
      options = ctxConsumer.config;
    }

    // Output
    return new Consumer(instance, options);
  }

  return ctxConsumer;
};
