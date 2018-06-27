import { OperatorFunction, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

import {
  FulfillAction,
  RejectAction,
  createFulfillAction,
  createRejectAction,
} from "./AsyncActions";

export function mapToAction<M, P>(
  meta: M,
  fulfill: string,
  reject: string,
): OperatorFunction<P, FulfillAction<P, M> | RejectAction<M>> {
  return stream =>
    stream.pipe(
      map(x => createFulfillAction<P, M>(fulfill, x, meta)),
      catchError(error => of(createRejectAction(reject, error, meta))),
    );
}
