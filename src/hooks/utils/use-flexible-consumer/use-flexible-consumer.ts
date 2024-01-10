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

    const defaultOptions = ctxConsumer.config;
    const { options: customOptions, mergeOptions } = consumer;

    if (customOptions && Object.keys(customOptions).length) {
      options = mergeOptions
        ? { ...defaultOptions, ...customOptions }
        : customOptions;
    } else {
      options = defaultOptions;
    }

    // Output
    return new Consumer(instance, options);
  }

  return ctxConsumer;
};
