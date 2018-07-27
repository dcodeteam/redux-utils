import { createExpireTransformConfig } from "../ExpireTransform";

describe("ExpireTransform", () => {
  test("init validation", () => {
    expect(() => {
      // @ts-ignore
      createExpireTransformConfig(null);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      createExpireTransformConfig(undefined);
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      createExpireTransformConfig(10, null);
    }).toThrowErrorMatchingSnapshot();
  });

  test("transformation", () => {
    let time = 1000;
    const now = () => time;
    const config = createExpireTransformConfig(1000, now);

    expect(config.in("foo")).toEqual({ r: "foo", t: 1000 });
    expect(config.out({ r: "foo", t: 1000 })).toBe("foo");

    time += 1000;

    expect(config.out({ r: "foo", t: 1000 })).toBe("foo");

    time += 500;

    expect(config.out({ r: "foo", t: 1000 })).toBe(null);
  });
});
