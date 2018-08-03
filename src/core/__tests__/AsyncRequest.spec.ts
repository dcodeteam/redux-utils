import { Action } from "redux";

import { FulfillAction, PerformAction, RejectAction } from "../AsyncActions";
import {
  createAsyncRequestReducer,
  getAsyncRequestError,
  getAsyncRequestResponse,
  getInitialAsyncRequest,
  isAsyncRequestFailed,
  isAsyncRequestPending,
  isAsyncRequestPerformed,
  isAsyncRequestSucceed,
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

  describe("getAsyncRequestError", () => {
    test("basics", () => {
      const error = new Error("AsyncRequestError");

      expect(getAsyncRequestError(undefined)).toBe(undefined);

      expect(
        getAsyncRequestError({
          requested: false,
          requesting: false,
          requestFailed: false,
        }),
      ).toBe(undefined);

      expect(
        getAsyncRequestError({
          error,
          requested: false,
          requesting: false,
          requestFailed: false,
        }),
      ).toBe(error);
    });
  });

  describe("getAsyncRequestResponse", () => {
    test("basics", () => {
      const response = {};

      expect(getAsyncRequestResponse(undefined)).toBe(undefined);

      expect(
        getAsyncRequestResponse({
          requested: false,
          requesting: false,
          requestFailed: false,
        }),
      ).toBe(undefined);

      expect(
        getAsyncRequestResponse({
          response,
          requested: false,
          requesting: false,
          requestFailed: false,
        }),
      ).toBe(response);
    });
  });

  describe("isAsyncRequestPerformed", () => {
    test("basics", () => {
      expect(isAsyncRequestPerformed(undefined)).toBe(false);

      expect(
        isAsyncRequestPerformed({
          requested: false,
          requesting: false,
          requestFailed: false,
        }),
      ).toBe(false);

      expect(
        isAsyncRequestPerformed({
          requested: true,
          requesting: false,
          requestFailed: false,
        }),
      ).toBe(true);
    });
  });

  describe("isAsyncRequestPending", () => {
    test("basics", () => {
      expect(isAsyncRequestPending(undefined)).toBe(false);

      expect(
        isAsyncRequestPending({
          requested: false,
          requesting: false,
          requestFailed: false,
        }),
      ).toBe(false);

      expect(
        isAsyncRequestPending({
          requested: false,
          requesting: true,
          requestFailed: false,
        }),
      ).toBe(true);
    });
  });

  describe("isAsyncRequestFailed", () => {
    test("basics", () => {
      expect(isAsyncRequestFailed(undefined)).toBe(false);

      expect(
        isAsyncRequestFailed({
          requested: false,
          requesting: false,
          requestFailed: false,
        }),
      ).toBe(false);

      expect(
        isAsyncRequestFailed({
          requested: false,
          requesting: false,
          requestFailed: true,
        }),
      ).toBe(true);
    });
  });

  describe("isAsyncRequestSucceed", () => {
    test("basics", () => {
      expect(isAsyncRequestSucceed(undefined)).toBe(false);

      expect(
        isAsyncRequestSucceed({
          requested: false,
          requesting: false,
          requestFailed: false,
        }),
      ).toBe(false);

      expect(
        isAsyncRequestSucceed({
          requested: true,
          requesting: false,
          requestFailed: false,
        }),
      ).toBe(true);
    });
  });
});
