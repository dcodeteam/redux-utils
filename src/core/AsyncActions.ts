import { Action, AnyAction } from "redux";

export interface PerformAction<M = any> extends Action {
  readonly meta: M;
}

export interface FulfillAction<P, M = any> extends PerformAction<M> {
  readonly payload: P;
}

export interface RejectAction<M = any> extends PerformAction<M> {
  readonly error: true;
  readonly payload: Error;
}

export function isPerformAction(action: AnyAction): action is PerformAction {
  return Boolean(
    action &&
      action.meta !== undefined &&
      action.error === undefined &&
      action.payload === undefined,
  );
}

export function createPerformAction<M>(
  type: string,
  meta: M,
): PerformAction<M> {
  return { meta, type };
}

export function isFulfillAction(
  action: AnyAction,
): action is FulfillAction<any> {
  return Boolean(
    action &&
      action.meta !== undefined &&
      action.error === undefined &&
      action.payload !== undefined,
  );
}

export function createFulfillAction<P, M = any>(
  type: string,
  payload: P,
  meta: M,
): FulfillAction<P, M> {
  return { meta, type, payload };
}

export function isRejectAction(action: AnyAction): action is RejectAction {
  return Boolean(
    action &&
      action.error === true &&
      action.meta !== undefined &&
      action.payload !== undefined,
  );
}

export function createRejectAction<M = any>(
  type: string,
  error: Error,
  meta: M,
): RejectAction<M> {
  return { meta, type, error: true, payload: error };
}
