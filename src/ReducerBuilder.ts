import { update } from "immupdate";
import { Reducer } from "redux";

import {
  invariant,
  isArray,
  isFunction,
  isPlainObject,
  warning,
} from "./internal/utils";
import { SubReducer } from "./types";

// eslint-disable-next-line typescript/no-type-alias,typescript/no-explicit-any
type PlainObject = { [name: string]: any };

export class ReducerBuilder<S extends PlainObject> {
  protected readonly initialState: S;

  protected readonly reducers: Array<SubReducer<S>> = [];

  public constructor(initialState: S) {
    invariant(
      isPlainObject(initialState),
      "ReducerBuilder: `initialState` expected to be a plain object.",
    );

    this.initialState = initialState;
  }

  public addSubReducer(reducer: SubReducer<S>): this {
    invariant(
      isFunction(reducer),
      "ReducerBuilder: `reducer` expected to be a function.",
    );

    this.reducers.push(reducer);

    return this;
  }

  public addActionsSubReducer(actions: string[], reducer: SubReducer<S>): this {
    invariant(
      isArray(actions),
      "ReducerBuilder: `actions` expected to be a array.",
    );

    invariant(
      isFunction(reducer),
      "ReducerBuilder: `reducer` expected to be a function.",
    );

    if (actions.length === 0) {
      warning(true, "ReducerBuilder: `actions` expected not to be empty.");
    } else {
      this.addSubReducer(
        (state, action) =>
          actions.indexOf(action.type) === -1 ? state : reducer(state, action),
      );
    }

    return this;
  }

  public addChildSubReducer<K extends keyof S>(
    childKey: K,
    reducer: SubReducer<S[K]>,
  ) {
    invariant(
      childKey != null,
      "ReducerBuilder: `childKey` expected to be defined.",
    );

    invariant(
      isFunction(reducer),
      "ReducerBuilder: `reducer` expected to be a function.",
    );

    this.addSubReducer((state, action) =>
      update(state, { [childKey]: reducer(state[childKey], action) }),
    );

    return this;
  }

  public build(): Reducer<S> {
    warning(
      this.reducers.length > 0,
      "ReducerBuilder: final reducer has no sub reducers.",
    );

    return (state = this.initialState, action) =>
      this.reducers.reduce((acc, reducer) => reducer(acc, action), state);
  }
}
