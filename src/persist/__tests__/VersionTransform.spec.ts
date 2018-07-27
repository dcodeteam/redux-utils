import { createVersionTransformConfig } from "../VersionTransform";

describe("VersionTransform", () => {
  test("init validation", () => {
    expect(() => {
      // @ts-ignore
      createVersionTransformConfig(null);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      createVersionTransformConfig(undefined);
    }).toThrowErrorMatchingSnapshot();
  });

  test("transformation", () => {
    const config = createVersionTransformConfig("foo");

    expect(config.in("bar")).toEqual({ v: "foo", r: "bar" });

    expect(config.out({ v: "foo", r: "bar" })).toBe("bar");
    expect(config.out({ v: "baz", r: "bar" })).toBe(null);
  });
});
