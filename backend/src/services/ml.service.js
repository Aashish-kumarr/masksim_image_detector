import { env } from "../config/env.js";
import { MockMlAdapter } from "./ml/mock.adapter.js";
import { FastApiMlAdapter } from "./ml/fastapi.adapter.js";

const adapter =
  env.mlMode === "fastapi"
    ? new FastApiMlAdapter()
    : new MockMlAdapter();

export const mlService = {
  predict(input) {
    return adapter.predict(input);
  },
};
