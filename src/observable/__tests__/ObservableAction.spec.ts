import { Subject } from "rxjs";

import { RejectAction } from "../../core/AsyncActions";
import { mapToAction } from "../ObservableAction";

describe("ObservableAction", () => {
  const fulfill = "fulfill";
  const reject = "reject";

  test("fulfill", done => {
    const meta = {};
    const source = new Subject();
    const payload = {};

    source
      .asObservable()
      .pipe(mapToAction(meta, fulfill, reject))
      .subscribe(
        action => {
          expect(action).toBeTruthy();
          expect(action.meta).toBe(meta);
          expect(action.type).toBe(fulfill);
          expect(action.payload).toBe(payload);
        },
        done,
        done,
      );

    source.next(payload);
    source.complete();

    expect.assertions(4);
  });

  test("reject", done => {
    const meta = {};
    const source = new Subject();
    const payload = {};
    const error = new Error("AsyncError");

    source.error(error);

    source
      .asObservable()
      .pipe(mapToAction(meta, fulfill, reject))
      .subscribe(
        action => {
          expect(action).toBeTruthy();
          expect(action.meta).toBe(meta);
          expect(action.type).toBe(reject);
          expect(action.payload).toBe(error);
          expect((action as RejectAction).error).toBe(true);
        },
        done,
        done,
      );

    source.next(payload);
    source.complete();

    expect.assertions(5);
  });
});
