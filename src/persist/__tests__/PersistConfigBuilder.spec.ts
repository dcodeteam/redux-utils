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

    expect(consoleError).toBeCalled();
    expect(consoleError.mock.calls).toMatchSnapshot();
  });

  test("duplicate whitelist keys", () => {
    const config = new PersistConfigBuilder({ foo: 1, bar: 2, baz: 3 })
      .whitelistChildren("foo", "bar")
      .whitelistChildren("bar", "baz")
      .whitelistChildren("baz", "foo")
      .build();

    expect(config.whitelist).toEqual(["foo", "bar", "baz"]);

    expect(consoleError).not.toBeCalled();
  });

  test("child transform validation", () => {
    const builder = new PersistConfigBuilder({ foo: 1 });

    expect(() => {
      // @ts-ignore
      builder.addChildTransforms(null);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildTransforms(undefined);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildTransforms("foo");
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildTransforms("foo", null);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildTransforms("foo", undefined);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildTransforms("foo", {});
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildTransforms("foo", { in: () => {} });
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      builder.addChildTransforms("foo", { out: () => {} });
    }).toThrowErrorMatchingSnapshot();

    expect(consoleError).not.toBeCalled();
  });

  test("child transform build", () => {
    const {
      whitelist,
      transforms,
      ...restConfigProps
    } = new PersistConfigBuilder({ foo: 1 })
      .addChildTransforms("foo", {
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
      .addChildTransforms("foo", {
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

  test("multiple child transforms build", () => {
    const { whitelist, transforms } = new PersistConfigBuilder({ foo: 1 })
      .addChildTransforms(
        "foo",
        { in: x => x * 2, out: x => x / 2 },
        { in: x => x + 10, out: x => x - 10 },
      )
      .build();

    expect(transforms).toBeTruthy();
    expect(whitelist).toEqual(["foo"]);

    const [t1, t2] = transforms!;

    expect(t1.in(1, "foo")).toBe(2);
    expect(t1.out(2, "foo")).toBe(1);

    expect(t2.in(1, "foo")).toBe(11);
    expect(t2.out(11, "foo")).toBe(1);

    expect(consoleError).not.toBeCalled();
  });
});
