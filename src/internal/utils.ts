import { PlainObject } from "../core/types";

export function isNumber(value: null | number | undefined): value is number {
  return typeof value === "number";
}

function isObjectType<T>(value: T, type: string): boolean {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}

export function isArray<T>(value: null | undefined | T[]): value is T[] {
  return isObjectType(value, "Array");
}

export function isPlainObject(
  value: null | undefined | PlainObject,
): value is PlainObject {
  return isObjectType(value, "Object");
}

export function isFunction<T>(value: null | undefined | T): value is T {
  return typeof value === "function";
}

function formatMessage(format: string, args: Array<number | string>): string {
  let argIndex = 0;

  return format.replace(
    /%s/g,
    // eslint-disable-next-line no-plusplus
    /* istanbul ignore next */ () => String(args[argIndex++]),
  );
}

export function warning(
  condition: boolean,
  format: string,
  ...args: Array<number | string>
): void {
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== "production") {
    if (!condition) {
      const message = formatMessage(format, args);

      /* istanbul ignore next */
      if (typeof console !== "undefined") {
        // eslint-disable-next-line no-console
        console.error(message);
      }

      try {
        throw new Error(message);
      } catch {}
    }
  }
}

export function invariant(
  condition: boolean,
  format: string,
  ...args: Array<number | string>
): void {
  if (!condition) {
    const message = formatMessage(format, args);
    const error = new Error(message);

    // @ts-ignore
    error.framesToPop = 1;
    error.name = "Invariant Violation";

    throw error;
  }
}
