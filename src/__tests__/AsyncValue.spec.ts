import { Action, AnyAction } from "redux";

import { FulfillAction, PerformAction, RejectAction } from "../AsyncActions";
import {
  createAsyncValueDictReducer,
  createAsyncValueReducer,
  getInitialAsyncValue,
} from "../AsyncValue";

describe("AsyncRequest", () => {
  const perform = "perform";
  const fulfill = "fulfill";
  const reject = "reject";
  const reset = "reset";

  describe("getInitialAsyncRequest", () => {
    test("initial value", () => {
      expect(getInitialAsyncValue()).toMatchSnapshot();
    });
  });

  describe("createAsyncRequestReducer", () => {
    test("creation", () => {
      const reducer = createAsyncValueReducer<number>(
        perform,
        fulfill,
        reject,
        reset,
      );

      expect(typeof reducer).toBe("function");
    });

    test("perform action", () => {
      const reducer = createAsyncValueReducer<number>(
        perform,
        fulfill,
        reject,
        reset,
      );

      const error = new Error("Async Error");
      const action: PerformAction = { meta: {}, type: perform };

      expect(reducer({ fetching: false }, action)).toEqual({
        fetching: true,
      });

      expect(reducer({ value: 10, fetching: false }, action)).toEqual({
        value: 10,
        fetching: true,
      });

      expect(reducer({ error, fetching: false }, action)).toEqual({
        error,
        fetching: true,
      });

      expect(reducer({ error, value: 10, fetching: false }, action)).toEqual({
        error,
        value: 10,
        fetching: true,
      });
    });

    test("fulfill action", () => {
      const reducer = createAsyncValueReducer<number>(
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

      expect(reducer({ fetching: true }, action)).toEqual({
        value: 30,
        fetching: false,
      });

      expect(reducer({ value: 10, fetching: true }, action)).toEqual({
        value: 30,
        fetching: false,
      });

      expect(reducer({ error, fetching: true }, action)).toEqual({
        value: 30,
        fetching: false,
      });

      expect(reducer({ error, value: 10, fetching: true }, action)).toEqual({
        value: 30,
        fetching: false,
      });
    });

    test("reject action", () => {
      const reducer = createAsyncValueReducer<number>(
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

      expect(reducer({ fetching: true }, action)).toEqual({
        fetching: false,
        error: actionError,
      });

      expect(reducer({ value: 10, fetching: true }, action)).toEqual({
        value: 10,
        fetching: false,
        error: actionError,
      });

      expect(reducer({ fetching: true, error: stateError }, action)).toEqual({
        fetching: false,
        error: actionError,
      });

      expect(
        reducer({ value: 10, fetching: true, error: stateError }, action),
      ).toEqual({
        value: 10,
        fetching: false,
        error: actionError,
      });
    });

    test("reset action", () => {
      const reducer = createAsyncValueReducer<number>(
        perform,
        fulfill,
        reject,
        reset,
      );

      const error = new Error("AsyncError: State.");
      const action: Action = { type: reset };

      expect(reducer({ fetching: true }, action)).toEqual({
        fetching: false,
      });

      expect(reducer({ value: 10, fetching: true }, action)).toEqual({
        fetching: false,
      });

      expect(reducer({ error, fetching: true }, action)).toEqual({
        fetching: false,
      });

      expect(reducer({ error, value: 10, fetching: true }, action)).toEqual({
        fetching: false,
      });
    });

    test("unknown action", () => {
      const reducer = createAsyncValueReducer<number>(
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
            fetching: true,
          },
          action,
        ),
      ).toEqual({ fetching: true });

      expect(reducer({ value: 10, fetching: true }, action)).toEqual({
        value: 10,
        fetching: true,
      });

      expect(reducer({ error, fetching: true }, action)).toEqual({
        error,
        fetching: true,
      });

      expect(reducer({ error, value: 10, fetching: true }, action)).toEqual({
        error,
        value: 10,
        fetching: true,
      });
    });
  });

  describe("createAsyncValueDictReducer", () => {
    interface ActionMeta {
      readonly id: number;
    }

    const hashResolver = (action: AnyAction) =>
      (action as PerformAction<ActionMeta>).meta.id;

    test("creation", () => {
      const reducer = createAsyncValueDictReducer<number>(
        hashResolver,
        perform,
        fulfill,
        reject,
        reset,
      );

      expect(typeof reducer).toBe("function");
    });

    test("unknown action", () => {
      const reducer = createAsyncValueDictReducer<number>(
        hashResolver,
        perform,
        fulfill,
        reject,
        reset,
      );

      const action: Action = { type: "FOO" };

      expect(reducer({}, action)).toEqual({});
    });

    test("flow", () => {
      const reducer = createAsyncValueDictReducer<number>(
        hashResolver,
        perform,
        fulfill,
        reject,
        reset,
      );

      let state = {};

      state = reducer(state, {
        type: perform,
        meta: { id: 1 },
      } as PerformAction<ActionMeta>);

      expect(state).toEqual({ 1: { fetching: true } });

      state = reducer(state, {
        payload: 10,
        type: fulfill,
        meta: { id: 1 },
      } as FulfillAction<number, ActionMeta>);

      expect(state).toEqual({ 1: { fetching: false, value: 10 } });

      state = reducer(state, {
        payload: 20,
        type: perform,
        meta: { id: 2 },
      } as FulfillAction<number, ActionMeta>);

      expect(state).toEqual({
        1: { fetching: false, value: 10 },
        2: { fetching: true },
      });

      const error = new Error("AsyncError");

      state = reducer(state, {
        payload: error,
        type: reject,
        meta: { id: 2 },
        error: true,
      } as RejectAction<ActionMeta>);

      expect(state).toEqual({
        1: { fetching: false, value: 10 },
        2: { fetching: false, error },
      });

      state = reducer(state, {
        type: perform,
        meta: { id: 2 },
      } as PerformAction<ActionMeta>);

      expect(state).toEqual({
        1: { fetching: false, value: 10 },
        2: { fetching: true, error },
      });

      state = reducer(state, {
        payload: 20,
        type: perform,
        meta: { id: 2 },
      } as FulfillAction<number, ActionMeta>);

      expect(state).toEqual({
        1: { fetching: false, value: 10 },
        2: { fetching: true, error },
      });
    });
  });
});
