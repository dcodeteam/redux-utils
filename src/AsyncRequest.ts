import { DELETE, update } from "immupdate";

import { FulfillAction, RejectAction } from "./AsyncActions";
import { SubReducer } from "./types";

export function getInitialAsyncRequest<V>(): AsyncRequest<V> {
  return {
    requested: false,
    requesting: false,
    requestFailed: false,
  };
}

export interface AsyncRequest<R = {}> {
  readonly error?: Error;
  readonly response?: R;

  readonly requested: boolean;
  readonly requesting: boolean;
  readonly requestFailed: boolean;
}

export function createAsyncRequestReducer<V>(
  perform: string,
  fulfill: string,
  reject: string,
  reset?: string,
): SubReducer<AsyncRequest<V>> {
  return (state: AsyncRequest<V>, action) => {
    if (action.type === perform) {
      return update(state, {
        requested: true,
        requesting: true,
      });
    }

    if (action.type === fulfill) {
      const { payload } = action as FulfillAction<V>;

      return update(state, {
        error: DELETE,
        response: payload,
        requesting: false,
        requestFailed: false,
      });
    }

    if (action.type === reject) {
      const { payload } = action as RejectAction;

      return update(state, {
        error: payload,
        requesting: false,
        requestFailed: true,
      });
    }

    if (action.type === reset) {
      return getInitialAsyncRequest();
    }

    return state;
  };
}
