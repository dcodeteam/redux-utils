import { composeTransforms } from "../ComposeTransforms";

describe("ComposeTransforms", () => {
  function identity<T>(x: T): T {
    return x;
  }

  it("should create single transform", () => {
    const in1 = jest.fn(identity);
    const out1 = jest.fn(identity);
    const in2 = jest.fn(identity);
    const out2 = jest.fn(identity);

    const transform = composeTransforms<number>(
      { in: in1, out: out1 },
      { in: in2, out: out2 },
    );

    expect(transform).toBeTruthy();

    expect(in1).toHaveBeenCalledTimes(0);
    expect(out1).toHaveBeenCalledTimes(0);
    expect(in2).toHaveBeenCalledTimes(0);
    expect(out2).toHaveBeenCalledTimes(0);

    expect(transform.in(1)).toBe(1);

    expect(in1).toHaveBeenCalledTimes(1);
    expect(in1).toHaveBeenLastCalledWith(1);
    expect(in2).toHaveBeenCalledTimes(1);
    expect(in2).toHaveBeenLastCalledWith(1);

    expect(transform.out(1)).toBe(1);

    expect(out1).toHaveBeenCalledTimes(1);
    expect(out1).toHaveBeenLastCalledWith(1);
    expect(out2).toHaveBeenCalledTimes(1);
    expect(out2).toHaveBeenLastCalledWith(1);

  });
});
