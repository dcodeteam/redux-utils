import {
  ReducerBuilder,
  createAsyncRequestReducer,
  createAsyncValueDictReducer,
  createAsyncValueReducer,
  createFulfillAction,
  createPerformAction,
  createRejectAction,
  getInitialAsyncRequest,
  getInitialAsyncValue,
  isFulfillAction,
  isPerformAction,
  isRejectAction,
  mapToAction,
} from "../index";

describe("index", () => {
  test("public api", () => {
    expect(typeof isPerformAction).toBe("function");
    expect(typeof createPerformAction).toBe("function");
    expect(typeof isFulfillAction).toBe("function");
    expect(typeof createFulfillAction).toBe("function");
    expect(typeof isRejectAction).toBe("function");
    expect(typeof createRejectAction).toBe("function");

    expect(typeof getInitialAsyncRequest).toBe("function");
    expect(typeof createAsyncRequestReducer).toBe("function");

    expect(typeof getInitialAsyncValue).toBe("function");
    expect(typeof createAsyncValueReducer).toBe("function");
    expect(typeof createAsyncValueDictReducer).toBe("function");

    expect(typeof mapToAction).toBe("function");

    expect(typeof ReducerBuilder).toBe("function");
  });
});
