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

export function normalizeText(raw: string) {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}
