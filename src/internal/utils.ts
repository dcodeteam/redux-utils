export function isNumber(value: null | number | undefined): value is number {
  return typeof value === "number";
}

// eslint-disable-next-line typescript/no-explicit-any
function isObjectType(value: any, type: string): boolean {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}

// eslint-disable-next-line typescript/no-explicit-any
export function isArray(value: any): value is Array<any> {
  return isObjectType(value, "Array");
}

// eslint-disable-next-line typescript/no-explicit-any
export function isPlainObject(value: any): value is object {
  return isObjectType(value, "Object");
}

export function isFunction<T>(value: T | Function): value is Function {
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

    error.name = "Invariant Violation";
    // eslint-disable-next-line typescript/no-explicit-any
    (error as any).framesToPop = 1;

    throw error;
  }
}
