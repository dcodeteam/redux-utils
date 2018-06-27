import { DELETE, update } from "immupdate";

import { FulfillAction, RejectAction } from "./AsyncActions";
import { SubReducer } from "./types";

export function getInitialAsyncRequest<V>(): AsyncRequest<V> {
  return {
    submitted: false,
    submitting: false,
    submitFailed: false,
  };
}

export interface AsyncRequest<R = {}> {
  readonly error?: Error;
  readonly response?: R;

  readonly submitted: boolean;
  readonly submitting: boolean;
  readonly submitFailed: boolean;
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
        submitted: true,
        submitting: true,
      });
    }

    if (action.type === fulfill) {
      const { payload } = action as FulfillAction<V>;

      return update(state, {
        error: DELETE,
        response: payload,
        submitting: false,
        submitFailed: false,
      });
    }

    if (action.type === reject) {
      const { payload } = action as RejectAction;

      return update(state, {
        error: payload,
        submitting: false,
        submitFailed: true,
      });
    }

    if (action.type === reset) {
      return getInitialAsyncRequest();
    }

    return state;
  };
}
