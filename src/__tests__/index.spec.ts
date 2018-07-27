import * as index from "..";

describe("index", () => {
  test("public api", () => {
    expect(index).toMatchSnapshot();
  });
});
