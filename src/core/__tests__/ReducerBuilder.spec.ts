import { mockConsole } from "../../__tests__/mockConsole";
import { ReducerBuilder } from "../ReducerBuilder";

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
    expect(() => {
      // eslint-disable-next-line no-new
      new ReducerBuilder([]);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      // eslint-disable-next-line no-new
      new ReducerBuilder(null);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      // eslint-disable-next-line no-new
      new ReducerBuilder(undefined);
    }).toThrowErrorMatchingSnapshot();

    expect(consoleError).not.toBeCalled();
  });

  test("build without sub reducers", () => {
    const builder = new ReducerBuilder({});

    builder.build();

    expect(consoleError.mock.calls).toMatchSnapshot();
  });

  test("sub reducer validation", () => {
    const builder = new ReducerBuilder({});

    expect(() => {
      // @ts-ignore
      builder.addSubReducer(null);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addSubReducer(undefined);
    }).toThrowErrorMatchingSnapshot();

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

    expect(() => {
      // @ts-ignore
      builder.addActionsSubReducer(null, identity);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addActionsSubReducer(undefined, identity);
    }).toThrowErrorMatchingSnapshot();

    expect(consoleError).not.toBeCalled();

    builder.addActionsSubReducer([], identity);

    expect(consoleError.mock.calls).toMatchSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addActionsSubReducer(["foo"], null);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addActionsSubReducer(["foo"], undefined);
    }).toThrowErrorMatchingSnapshot();

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

    expect(() => {
      // @ts-ignore
      builder.addChildSubReducer(null, identity);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildSubReducer(undefined, identity);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildSubReducer("counter", null);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildSubReducer("counter", undefined);
    }).toThrowErrorMatchingSnapshot();

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
