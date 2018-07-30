import { TransformConfig } from "./PersistConfigBuilder";

export function composeTransforms<S>(
  ...configs: Array<TransformConfig<S>>
): TransformConfig<S> {
  return {
    in: state => configs.reduce((acc, config) => config.in(acc), state),
    out: state => configs.reduce((acc, config) => config.out(acc), state),
  };
}
