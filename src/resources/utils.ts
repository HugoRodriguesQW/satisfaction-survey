/* eslint-disable @typescript-eslint/no-explicit-any */

/*  Fuction to validate the properties type */
export function it(...props: unknown[]) {
  const validation = [] as boolean[];

  const classes = {
    exists: () => {
      validation.push(props.every((p) => p != null));
      return validation.every((v) => v);
    },
    is(basicType: boolean | string | number | object) {
      validation.push(props.every((p) => typeof p === typeof basicType));
      return validation.every((v) => v);
    },

    custom(f: (prop: any) => boolean) {
      validation.push(f(props));
      return validation.every((v) => v);
    },
  };

  return classes;
}


/* Function to filter safe object properties only */
export function SafeObject<T extends Record<string, any>, F extends SafeFilter>(
  source: T,
  filter: F & { [K in keyof T]?: 1 | 0 }
) {
  const safe = {} as Record<string, any>;
  for (const f in filter) {
    if (filter[f] && source[f] !== undefined) {
      safe[f] = source[f];
    }
  }

  return safe as Filtered<T, F>;
}

/* Function to convert Hex to UTF-8 */
export function HexToUtf8(hex: string) {
  return Buffer.from(hex, "hex").toString("utf8");
}

/* Function to convert Hex to UTF-8 */
export function Utf8ToHex(utf8: string) {
  return Buffer.from(utf8, "utf8").toString("hex");
}

type SafeFilter = { [p: string]: 1 | 0 };
type Filtered<T extends Record<string, any>, F extends SafeFilter> = {
  [K in keyof F & keyof T]: T[K];
};
