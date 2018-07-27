import { invariant, isFunction, isNumber } from "../internal/utils";
import { TransformConfig } from "./PersistConfigBuilder";

interface Plain<S> {
  r: S;
  t: number;
}

export function createExpireTransformConfig<S>(
  expireAfter: number,
  now: () => number = Date.now,
): TransformConfig<S, Plain<S>> {
  invariant(
    isNumber(expireAfter) && expireAfter > 0,
    "createExpireTransformConfig: `expireAfter` expected to be a positive number.",
  );

  invariant(
    isFunction(now),
    "createExpireTransformConfig: `now` expected to be a function.",
  );

  return {
    in(state) {
      return { t: now(), r: state };
    },

    out(plain) {
      return !plain || !plain.t || plain.t + expireAfter < now()
        ? null
        : plain.r;
    },
  };
}
