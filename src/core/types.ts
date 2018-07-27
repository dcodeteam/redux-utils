import { Action } from "redux";

export type SubReducer<S, A = Action> = (state: S, action: A) => S;

export interface Dict<T> {
  readonly [key: string]: undefined | T;
}

// eslint-disable-next-line typescript/no-type-alias,typescript/no-explicit-any
export type PlainObject = { [name: string]: any };
