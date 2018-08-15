import { PersistConfig, Transform } from "redux-persist";

import { PlainObject } from "../core/types";
import {
  invariant,
  isFunction,
  isPlainObject,
  warning,
} from "../internal/utils";

export interface TransformConfig<S, R = any> {
  in: (state: S) => null | R;
  out: (raw: null | undefined | R) => null | S;
}

export class PersistConfigBuilder<S extends PlainObject> {
  private readonly initialState: S;

  private readonly whitelist: string[] = [];

  // eslint-disable-next-line typescript/no-explicit-any
  private readonly transforms: Array<Transform<any, any>> = [];

  public constructor(initialState: S) {
    invariant(
      isPlainObject(initialState),
      "ReducerBuilder: `initialState` expected to be a plain object.",
    );

    this.initialState = initialState;
  }

  public whitelistChildren(...childKeys: Array<keyof S>): this {
    childKeys.forEach(x => {
      const key = String(x);

      if (this.whitelist.indexOf(key) === -1) {
        this.whitelist.push(key);
      }
    });

    return this;
  }

  public addChildTransforms<K extends keyof S>(
    childKey: K,
    ...configs: Array<TransformConfig<S[K]>>
  ): this {
    invariant(
      childKey != null,
      "PersistConfigBuilder: `childKey` expected to be defined.",
    );

    const { [childKey]: childState } = this.initialState;

    this.whitelistChildren(childKey);

    invariant(
      configs.length > 0,
      "PersistConfigBuilder: at least one transform should be passed.",
    );

    configs.forEach(config => {
      invariant(
        config != null,
        "PersistConfigBuilder: `config` expected to be defined.",
      );

      const { in: inbound, out: outbound } = config;

      invariant(
        isFunction(inbound),
        "PersistConfigBuilder: `config.in` expected to be a function.",
      );

      invariant(
        isFunction(outbound),
        "PersistConfigBuilder: `config.out` expected to be a function.",
      );

      this.transforms.push({
        in: (x: S[K], k) => (k !== childKey ? x : inbound(x)),
        out: (x, k): S[K] => (k !== childKey ? x : outbound(x) || childState),
      });
    });

    return this;
  }

  public build(): Partial<PersistConfig> {
    warning(
      this.whitelist.length > 0,
      "PersistConfigBuilder: persist config has not whitelisted keys.",
    );

    return { whitelist: this.whitelist, transforms: this.transforms };
  }
}
