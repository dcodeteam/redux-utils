import { DELETE, update } from "immupdate";
import { AnyAction } from "redux";

import { FulfillAction, RejectAction } from "./AsyncActions";
import { Dict, SubReducer } from "./types";

export function getInitialAsyncValue<V>(): AsyncValue<V> {
  return { fetching: false };
}

export interface AsyncValue<V = {}> {
  readonly payload?: V;
  readonly error?: Error;
  readonly fetching: boolean;
}

export function createAsyncValueReducer<V>(
  perform: string,
  fulfill: string,
  reject: string,
  reset?: string,
): SubReducer<AsyncValue<V>> {
  return (state: AsyncValue<V>, action) => {
    if (action.type === perform) {
      return update(state, {
        fetching: true,
      });
    }

    if (action.type === fulfill) {
      const { payload } = action as FulfillAction<V>;

      return update(state, {
        payload,
        error: DELETE,
        fetching: false,
      });
    }

    if (action.type === reject) {
      const { payload } = action as RejectAction;

      return update(state, {
        error: payload,
        fetching: false,
      });
    }

    if (action.type === reset) {
      return getInitialAsyncValue();
    }

    return state;
  };
}

export function createAsyncValueDictReducer<V>(
  hashResolver: (action: AnyAction) => number | string,
  perform: string,
  fulfill: string,
  reject: string,
  reset?: string,
): SubReducer<Dict<AsyncValue<V>>> {
  const reducer = createAsyncValueReducer<V>(perform, fulfill, reject, reset);
  const actions = [perform, fulfill, reject, reset];

  return (state: Dict<AsyncValue<V>>, action) => {
    if (actions.indexOf(action.type) === -1) {
      return state;
    }

    const key = hashResolver(action);
    const { [key]: childState = getInitialAsyncValue<V>() } = state;

    return update(state, {
      [key]: reducer(childState, action),
    });
  };
}

export function isAsyncValueFetching<T>(
  value: undefined | AsyncValue<T>,
): value is AsyncValue<T> {
  return Boolean(value && value.fetching);
}

export function getAsyncValueError(
  value: undefined | AsyncValue,
): undefined | Error {
  return value && value.error;
}

export function getAsyncValuePayload<T>(
  value: undefined | AsyncValue<T>,
): undefined | T {
  return value && value.payload;
}
