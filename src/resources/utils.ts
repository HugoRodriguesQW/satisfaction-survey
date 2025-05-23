/* eslint-disable @typescript-eslint/no-explicit-any */

/*  Fuction to validate the properties type */
export function it(...props: unknown[]) {
  const validation = [] as boolean[];

  const classes = {
    exists: () => {
      validation.push(props.every((p) => p != null));
      return validation.every(Boolean);
    },
    is(...basicType: Array<boolean | string | number | object>) {
      const types = basicType.map((t) => typeof t);
      validation.push(props.every((p) => types.includes(typeof p)));
      return validation.every(Boolean);
    },

    eq(...values: unknown[]) {
      validation.push(props.every((p) => values.includes(p)));
      return validation.every(Boolean);
    },

    custom(f: (prop: any) => boolean) {
      validation.push(f(props));
      return validation.every(Boolean);
    },
  };

  return classes;
}

export function SafeObject<T extends Record<string, any>, F extends SafeFilterRecursive<T>>(source: T, filter: F) {
  const safe = {} as Record<string, any>;
  for (const f in filter) {
    if (typeof filter[f] !== "number" && filter[f]) {
      const filtered = SafeObject(source[f], filter[f]);
      if (filtered && Object.keys(filtered).length > 0) {
        safe[f] = filtered;
      }
      continue;
    }
    if (filter[f] && source[f] !== undefined) {
      safe[f] = source[f];
    }
  }
  return safe as Filtered<T, F>;
}

type SafeFilterRecursive<T> = {
  [K in keyof T]?: T[K] extends Array<any> ? 1 : T[K] extends Record<string, any> ? 1 | SafeFilterRecursive<T[K]> : 1;
};

type Filtered<T extends Record<string, any>, F extends SafeFilterRecursive<T>> = {
  [K in keyof F & keyof T]: F[K] extends 1
    ? T[K] // inclui o campo inteiro, com todos subcampos
    : F[K] extends SafeFilterRecursive<T[K]>
    ? T[K] extends Record<string, any>
      ? Filtered<T[K], F[K]>
      : never
    : never;
};

export function normalizeText(raw: string) {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

export function bigNumber(value: number) {
  const keys = [
    [1000, "mil"],
    [1000000, "mi"],
    [1000000000, "bi"],
    [1000000000000, "tri"],
  ] as [number, string][];

  const [divisor, symbol] = keys.findLast(([s]) => s < value) ?? [1, ""];

  return `${Math.ceil(value / divisor)}${symbol}`;
}

export function clone<T>(something: T): T {
  return JSON.parse(JSON.stringify(something));
}

export function merge<T extends Record<string, any>, J extends Record<string, any>>(obj1: T, obj2: J) {
  return Object.assign(obj1, obj2);
}
