import { Action } from "redux";

import {
  FulfillAction,
  PerformAction,
  RejectAction,
  createFulfillAction,
  createPerformAction,
  createRejectAction,
  isFulfillAction,
  isPerformAction,
  isRejectAction,
} from "../AsyncActions";

describe("AsyncAction", () => {
  const actions = {
    basic: { type: "foo" } as Action,
    perform: { meta: {}, type: "foo" } as PerformAction,
    fulfill: { meta: {}, type: "foo", payload: 10 } as FulfillAction<number>,

    reject: {
      meta: {},
      type: "foo",
      error: true,
      payload: new Error("AsyncError"),
    } as RejectAction,
  };

  test("createPerformAction", () => {
    const meta = {};
    const action = createPerformAction("foo", meta);

    expect(action.meta).toBe(meta);
    expect(action.type).toBe("foo");

    expect(Object.keys(action)).toEqual(["meta", "type"]);
  });

  test("isPerformAction", () => {
    expect(isPerformAction(actions.basic)).toBe(false);
    expect(isPerformAction(actions.perform)).toBe(true);
    expect(isPerformAction(actions.fulfill)).toBe(false);
    expect(isPerformAction(actions.reject)).toBe(false);
  });

  test("createFulfillAction", () => {
    const meta = {};
    const payload = {};
    const action = createFulfillAction("foo", payload, meta);

    expect(action.meta).toBe(meta);
    expect(action.payload).toBe(payload);
    expect(action.type).toBe("foo");

    expect(Object.keys(action)).toEqual(["meta", "type", "payload"]);
  });

  test("isFulfillAction", () => {
    expect(isFulfillAction(actions.basic)).toBe(false);
    expect(isFulfillAction(actions.perform)).toBe(false);
    expect(isFulfillAction(actions.fulfill)).toBe(true);
    expect(isFulfillAction(actions.reject)).toBe(false);
  });

  test("createRejectAction", () => {
    const meta = {};
    const error = new Error("AsyncError");
    const action = createRejectAction("foo", error, meta);

    expect(action.meta).toBe(meta);
    expect(action.payload).toBe(error);
    expect(action.type).toBe("foo");
    expect(action.error).toBe(true);

    expect(Object.keys(action)).toEqual(["meta", "type", "error", "payload"]);
  });

  test("isRejectAction", () => {
    expect(isRejectAction(actions.basic)).toBe(false);
    expect(isRejectAction(actions.perform)).toBe(false);
    expect(isRejectAction(actions.fulfill)).toBe(false);
    expect(isRejectAction(actions.reject)).toBe(true);
  });
});
