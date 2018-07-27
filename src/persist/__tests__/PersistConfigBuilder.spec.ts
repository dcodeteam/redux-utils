import { mockConsole } from "../../__tests__/mockConsole";
import { PersistConfigBuilder } from "../PersistConfigBuilder";

describe("PersistConfigBuilder", () => {
  const consoleError = jest.fn();

  mockConsole({ error: consoleError });

  test("init validation", () => {
    expect(() => {
      // @ts-ignore
      // eslint-disable-next-line no-new
      new PersistConfigBuilder([]);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      // eslint-disable-next-line no-new
      new PersistConfigBuilder(null);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      // eslint-disable-next-line no-new
      new PersistConfigBuilder(undefined);
    }).toThrowErrorMatchingSnapshot();
  });

  test("build without whitelisted keys", () => {
    const config = new PersistConfigBuilder({}).build();

    expect(config).toBeTruthy();
    expect(consoleError.mock.calls).toMatchSnapshot();
  });

  test("duplicate whitelist keys", () => {
    const config = new PersistConfigBuilder({ foo: 1, bar: 2, baz: 3 })
      .whitelistKeys("foo", "bar")
      .whitelistKeys("bar", "baz")
      .whitelistKeys("baz", "foo")
      .build();

    expect(config.whitelist).toEqual(["foo", "bar", "baz"]);

    expect(consoleError).not.toBeCalled();
  });

  test("child transform validation", () => {
    const builder = new PersistConfigBuilder({ foo: 1 });

    expect(() => {
      // @ts-ignore
      builder.addChildTransform(null);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildTransform(undefined);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildTransform("foo");
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildTransform("foo", null);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildTransform("foo", undefined);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildTransform("foo", {});
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildTransform("foo", { in: () => {} });
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildTransform("foo", { out: () => {} });
    }).toThrowErrorMatchingSnapshot();

    expect(consoleError).not.toBeCalled();
  });

  test("child transform build", () => {
    const {
      whitelist,
      transforms,
      ...restConfigProps
    } = new PersistConfigBuilder({ foo: 1 })
      .addChildTransform("foo", {
        in: x => JSON.stringify(x),
        out: x => JSON.parse(x),
      })
      .build();

    expect(transforms).toBeTruthy();
    expect(whitelist).toEqual(["foo"]);
    expect(restConfigProps).toEqual({});

    const [transform, ...restTransforms] = transforms!;

    expect(restTransforms).toEqual([]);

    const plain = { quoz: 1 };
    const json = JSON.stringify(plain);

    expect(transform.in(plain, "foo")).toBe(json);
    expect(transform.out(json, "foo")).toEqual(plain);

    expect(transform.in(plain, "bar")).toBe(plain);
    expect(transform.out(plain, "bar")).toBe(plain);

    expect(consoleError).not.toBeCalled();
  });

  test("empty child transform build", () => {
    const { whitelist, transforms } = new PersistConfigBuilder({ foo: 1 })
      .addChildTransform("foo", {
        in: x => JSON.stringify(x),
        out: x => JSON.parse(x),
      })
      .build();

    expect(transforms).toBeTruthy();
    expect(whitelist).toEqual(["foo"]);

    const [transform] = transforms!;

    expect(transform.in(null, "foo")).toBe("null");
    expect(transform.out(null, "foo")).toBe(1);

    expect(consoleError).not.toBeCalled();
  });
});
