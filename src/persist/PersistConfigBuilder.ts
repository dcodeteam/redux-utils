import { PersistConfig, Transform, createTransform } from "redux-persist";

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

  public whitelistKeys(...keys: Array<keyof S>): this {
    keys.forEach(x => {
      const key = String(x);

      if (this.whitelist.indexOf(key) === -1) {
        this.whitelist.push(key);
      }
    });

    return this;
  }

  public addChildTransform<K extends keyof S>(
    childKey: K,
    config: TransformConfig<S[K]>,
  ): this {
    invariant(
      childKey != null,
      "PersistConfigBuilder: `childKey` expected to be defined.",
    );

    invariant(
      config != null,
      "PersistConfigBuilder: `config` expected to be defined.",
    );

    invariant(
      isFunction(config.in),
      "PersistConfigBuilder: `config.in` expected to be a function.",
    );

    invariant(
      isFunction(config.out),
      "PersistConfigBuilder: `config.out` expected to be a function.",
    );

    this.whitelistKeys(childKey);

    this.transforms.push(
      createTransform<S[K], any>(
        config.in,
        raw => config.out(raw) || this.initialState[childKey],
        { whitelist: [String(childKey)] },
      ),
    );

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
