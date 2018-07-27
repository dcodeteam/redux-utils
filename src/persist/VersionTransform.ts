import { invariant } from "../internal/utils";
import { TransformConfig } from "./PersistConfigBuilder";

interface Plain<S> {
  r: S;
  v: string;
}

export function createVersionTransformConfig<S>(
  version: string,
): TransformConfig<S, Plain<S>> {
  invariant(
    version != null,
    "createVersionTransformConfig: `version` expected to be defined.",
  );

  return {
    in(state) {
      return { v: version, r: state };
    },

    out(plain) {
      return !plain || plain.v !== version ? null : plain.r;
    },
  };
}
