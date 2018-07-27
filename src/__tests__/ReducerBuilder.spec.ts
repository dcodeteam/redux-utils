import { ReducerBuilder } from "../ReducerBuilder";
import { mockConsole } from "./mockConsole";

interface CounterState {
  readonly counter: number;
}

function getCounterIntialState(): CounterState {
  return { counter: 0 };
}

function counterReducer(state: CounterState): CounterState {
  return { counter: state.counter + 1 };
}

describe("ReducerBuilder", () => {
  const identity = <T>(s: T): T => s;
  const consoleError = jest.fn();

  mockConsole({ error: consoleError });

  test("init validation", () => {
    expect(() => new ReducerBuilder([])).toThrowErrorMatchingSnapshot();

    expect(
      () => new ReducerBuilder(null as any),
    ).toThrowErrorMatchingSnapshot();

    expect(
      () => new ReducerBuilder(undefined as any),
    ).toThrowErrorMatchingSnapshot();

    expect(consoleError).not.toBeCalled();
  });

  test("build without sub reducers", () => {
    const builder = new ReducerBuilder({});

    builder.build();

    expect(consoleError.mock.calls).toMatchSnapshot();
  });

  test("sub reducer validation", () => {
    const builder = new ReducerBuilder({});

    expect(() =>
      builder.addSubReducer(null as any),
    ).toThrowErrorMatchingSnapshot();

    expect(() =>
      builder.addSubReducer(undefined as any),
    ).toThrowErrorMatchingSnapshot();

    expect(consoleError).not.toBeCalled();
  });

  test("sub reducer build", () => {
    const reducer = new ReducerBuilder(getCounterIntialState())
      .addSubReducer(counterReducer)
      .build();

    expect(reducer(undefined, { type: "foo" })).toEqual({ counter: 1 });
    expect(reducer({ counter: 1 }, { type: "foo" })).toEqual({ counter: 2 });

    expect(consoleError).not.toBeCalled();
  });

  test("actions reducer validation", () => {
    const builder = new ReducerBuilder({});

    expect(() =>
      builder.addActionsSubReducer(null as any, identity),
    ).toThrowErrorMatchingSnapshot();

    expect(() =>
      builder.addActionsSubReducer(undefined as any, identity),
    ).toThrowErrorMatchingSnapshot();

    expect(consoleError).not.toBeCalled();

    builder.addActionsSubReducer([], identity);

    expect(consoleError.mock.calls).toMatchSnapshot();

    expect(() =>
      builder.addActionsSubReducer(["foo"], null as any),
    ).toThrowErrorMatchingSnapshot();

    expect(() =>
      builder.addActionsSubReducer(["foo"], undefined as any),
    ).toThrowErrorMatchingSnapshot();

    expect(consoleError).not.toBeCalled();
  });

  test("actions reducer with empty actions", () => {
    const reducer = new ReducerBuilder(getCounterIntialState())
      .addActionsSubReducer([], counterReducer)
      .build();

    expect(reducer(undefined, { type: "foo" })).toEqual({ counter: 0 });
    expect(reducer(undefined, { type: "bar" })).toEqual({ counter: 0 });

    expect(reducer({ counter: 1 }, { type: "foo" })).toEqual({ counter: 1 });
    expect(reducer({ counter: 1 }, { type: "bar" })).toEqual({ counter: 1 });

    expect(consoleError.mock.calls).toMatchSnapshot();
  });

  test("actions reducer with actions", () => {
    const reducer = new ReducerBuilder(getCounterIntialState())
      .addActionsSubReducer(["foo"], counterReducer)
      .build();

    expect(reducer(undefined, { type: "foo" })).toEqual({ counter: 1 });
    expect(reducer(undefined, { type: "bar" })).toEqual({ counter: 0 });

    expect(reducer({ counter: 1 }, { type: "foo" })).toEqual({ counter: 2 });
    expect(reducer({ counter: 1 }, { type: "bar" })).toEqual({ counter: 1 });

    expect(consoleError).not.toBeCalled();
  });

  test("child reducer validation", () => {
    const builder = new ReducerBuilder(getCounterIntialState());

    expect(() =>
      builder.addChildSubReducer(null as any, identity),
    ).toThrowErrorMatchingSnapshot();

    expect(() =>
      builder.addChildSubReducer(undefined as any, identity),
    ).toThrowErrorMatchingSnapshot();

    expect(() =>
      builder.addChildSubReducer("counter", null as any),
    ).toThrowErrorMatchingSnapshot();

    expect(() =>
      builder.addChildSubReducer("counter", undefined as any),
    ).toThrowErrorMatchingSnapshot();

    expect(consoleError).not.toBeCalled();
  });

  test("child reducer", () => {
    const reducer = new ReducerBuilder(getCounterIntialState())
      .addChildSubReducer("counter", state => state + 1)
      .build();

    expect(reducer(undefined, { type: "foo" })).toEqual({ counter: 1 });
    expect(reducer(undefined, { type: "bar" })).toEqual({ counter: 1 });

    expect(reducer({ counter: 1 }, { type: "foo" })).toEqual({ counter: 2 });
    expect(reducer({ counter: 1 }, { type: "bar" })).toEqual({ counter: 2 });

    expect(consoleError).not.toBeCalled();
  });
});
