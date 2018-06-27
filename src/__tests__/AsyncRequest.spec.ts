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
            submitted: false,
            submitting: false,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        submitted: true,
        submitting: true,
        submitFailed: false,
      });

      expect(
        reducer(
          {
            response: 10,
            submitted: true,
            submitting: false,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 10,
        submitted: true,
        submitting: true,
        submitFailed: false,
      });

      expect(
        reducer(
          {
            error,
            submitted: true,
            submitting: false,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        error,
        submitted: true,
        submitting: true,
        submitFailed: false,
      });

      expect(
        reducer(
          {
            error,
            response: 10,
            submitted: true,
            submitting: false,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        error,
        response: 10,
        submitted: true,
        submitting: true,
        submitFailed: false,
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
            submitted: true,
            submitting: true,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 30,
        submitted: true,
        submitting: false,
        submitFailed: false,
      });

      expect(
        reducer(
          {
            response: 10,
            submitted: true,
            submitting: true,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 30,
        submitted: true,
        submitting: false,
        submitFailed: false,
      });

      expect(
        reducer(
          {
            error,
            submitted: true,
            submitting: false,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 30,
        submitted: true,
        submitting: false,
        submitFailed: false,
      });

      expect(
        reducer(
          {
            error,
            response: 10,
            submitted: true,
            submitting: false,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 30,
        submitted: true,
        submitting: false,
        submitFailed: false,
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
            submitted: true,
            submitting: true,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        error: actionError,
        submitted: true,
        submitting: false,
        submitFailed: true,
      });

      expect(
        reducer(
          {
            response: 10,
            submitted: true,
            submitting: true,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 10,
        error: actionError,
        submitted: true,
        submitting: false,
        submitFailed: true,
      });

      expect(
        reducer(
          {
            error: stateError,
            submitted: true,
            submitting: true,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        error: actionError,
        submitted: true,
        submitting: false,
        submitFailed: true,
      });

      expect(
        reducer(
          {
            response: 10,
            error: stateError,
            submitted: true,
            submitting: true,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 10,
        error: actionError,
        submitted: true,
        submitting: false,
        submitFailed: true,
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
            submitted: true,
            submitting: true,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        submitted: false,
        submitting: false,
        submitFailed: false,
      });

      expect(
        reducer(
          {
            response: 10,
            submitted: true,
            submitting: true,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        submitted: false,
        submitting: false,
        submitFailed: false,
      });

      expect(
        reducer(
          {
            error,
            submitted: true,
            submitting: true,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        submitted: false,
        submitting: false,
        submitFailed: false,
      });

      expect(
        reducer(
          {
            error,
            response: 10,
            submitted: true,
            submitting: true,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        submitted: false,
        submitting: false,
        submitFailed: false,
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
            submitted: true,
            submitting: true,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        submitted: true,
        submitting: true,
        submitFailed: false,
      });

      expect(
        reducer(
          {
            response: 10,
            submitted: true,
            submitting: true,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        response: 10,
        submitted: true,
        submitting: true,
        submitFailed: false,
      });

      expect(
        reducer(
          {
            error,
            submitted: true,
            submitting: true,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        error,
        submitted: true,
        submitting: true,
        submitFailed: false,
      });

      expect(
        reducer(
          {
            error,
            response: 10,
            submitted: true,
            submitting: true,
            submitFailed: false,
          },
          action,
        ),
      ).toEqual({
        error,
        response: 10,
        submitted: true,
        submitting: true,
        submitFailed: false,
      });
    });
  });
});
