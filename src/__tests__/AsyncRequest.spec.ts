import { Action } from "redux";

import { FulfillAction, PerformAction, RejectAction } from "../AsyncActions";
import {
  createAsyncRequestReducer,
  getInitialAsyncRequest,
} from "../AsyncRequest";

describe("AsyncRequest", () => {
  describe("getInitialAsyncRequest", () => {
    test("initial value", () => {
      expect(getInitialAsyncRequest()).toMatchSnapshot();
    });
  });

  describe("createAsyncRequestReducer", () => {
    const perform = "perform";
    const fulfill = "fulfill";
    const reject = "reject";
    const reset = "reset";

    test("creation", () => {
      const reducer = createAsyncRequestReducer<number>(
        perform,
        fulfill,
        reject,
        reset,
      );

      expect(typeof reducer).toBe("function");
    });

    test("perform action", () => {
      const reducer = createAsyncRequestReducer<number>(
        perform,
        fulfill,
        reject,
        reset,
      );

      const error = new Error("Async Error");
      const action: PerformAction = { meta: {}, type: perform };

      expect(
        reducer(
          {
            requested: false,
            requesting: false,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        requested: true,
        requesting: true,
        requestFailed: false,
      });

      expect(
        reducer(
          {
            response: 10,
            requested: true,
            requesting: false,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 10,
        requested: true,
        requesting: true,
        requestFailed: false,
      });

      expect(
        reducer(
          {
            error,
            requested: true,
            requesting: false,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        error,
        requested: true,
        requesting: true,
        requestFailed: false,
      });

      expect(
        reducer(
          {
            error,
            response: 10,
            requested: true,
            requesting: false,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        error,
        response: 10,
        requested: true,
        requesting: true,
        requestFailed: false,
      });
    });

    test("fulfill action", () => {
      const reducer = createAsyncRequestReducer<number>(
        perform,
        fulfill,
        reject,
        reset,
      );

      const error = new Error("Async Error");
      const action: FulfillAction<number> = {
        meta: {},
        payload: 30,
        type: fulfill,
      };

      expect(
        reducer(
          {
            requested: true,
            requesting: true,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 30,
        requested: true,
        requesting: false,
        requestFailed: false,
      });

      expect(
        reducer(
          {
            response: 10,
            requested: true,
            requesting: true,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 30,
        requested: true,
        requesting: false,
        requestFailed: false,
      });

      expect(
        reducer(
          {
            error,
            requested: true,
            requesting: false,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 30,
        requested: true,
        requesting: false,
        requestFailed: false,
      });

      expect(
        reducer(
          {
            error,
            response: 10,
            requested: true,
            requesting: false,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 30,
        requested: true,
        requesting: false,
        requestFailed: false,
      });
    });

    test("reject action", () => {
      const reducer = createAsyncRequestReducer<number>(
        perform,
        fulfill,
        reject,
        reset,
      );

      const stateError = new Error("AsyncError: State.");
      const actionError = new Error("AsyncError: Action.");
      const action: RejectAction = {
        meta: {},
        error: true,
        type: reject,
        payload: actionError,
      };

      expect(
        reducer(
          {
            requested: true,
            requesting: true,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        error: actionError,
        requested: true,
        requesting: false,
        requestFailed: true,
      });

      expect(
        reducer(
          {
            response: 10,
            requested: true,
            requesting: true,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 10,
        error: actionError,
        requested: true,
        requesting: false,
        requestFailed: true,
      });

      expect(
        reducer(
          {
            error: stateError,
            requested: true,
            requesting: true,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        error: actionError,
        requested: true,
        requesting: false,
        requestFailed: true,
      });

      expect(
        reducer(
          {
            response: 10,
            error: stateError,
            requested: true,
            requesting: true,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 10,
        error: actionError,
        requested: true,
        requesting: false,
        requestFailed: true,
      });
    });

    test("reset action", () => {
      const reducer = createAsyncRequestReducer<number>(
        perform,
        fulfill,
        reject,
        reset,
      );

      const error = new Error("AsyncError: State.");
      const action: Action = { type: reset };

      expect(
        reducer(
          {
            requested: true,
            requesting: true,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        requested: false,
        requesting: false,
        requestFailed: false,
      });

      expect(
        reducer(
          {
            response: 10,
            requested: true,
            requesting: true,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        requested: false,
        requesting: false,
        requestFailed: false,
      });

      expect(
        reducer(
          {
            error,
            requested: true,
            requesting: true,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        requested: false,
        requesting: false,
        requestFailed: false,
      });

      expect(
        reducer(
          {
            error,
            response: 10,
            requested: true,
            requesting: true,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        requested: false,
        requesting: false,
        requestFailed: false,
      });
    });

    test("unknown action", () => {
      const reducer = createAsyncRequestReducer<number>(
        perform,
        fulfill,
        reject,
        reset,
      );

      const error = new Error("AsyncError: State.");
      const action: Action = { type: "FOO" };

      expect(
        reducer(
          {
            requested: true,
            requesting: true,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        requested: true,
        requesting: true,
        requestFailed: false,
      });

      expect(
        reducer(
          {
            response: 10,
            requested: true,
            requesting: true,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 10,
        requested: true,
        requesting: true,
        requestFailed: false,
      });

      expect(
        reducer(
          {
            error,
            requested: true,
            requesting: true,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        error,
        requested: true,
        requesting: true,
        requestFailed: false,
      });

      expect(
        reducer(
          {
            error,
            response: 10,
            requested: true,
            requesting: true,
            requestFailed: false,
          },
          action,
        ),
      ).toEqual({
        error,
        response: 10,
        requested: true,
        requesting: true,
        requestFailed: false,
      });
    });
  });
});
