import { v4 as uuidv4 } from 'uuid';
import { TimeLongUnit, TimeUnit } from './definitions';

/* eslint-disable @typescript-eslint/no-explicit-any */


/* Function to plurarize the text */
export function plural(text: string, number: number, customchar?: string) {
  if (number !== 1) {
    return text + (customchar ?? "s")
  }

  return text;
}

/* Function to convert time range in awesome text display */
type RelativeTimeCustom = {
  inText?: string,
  agoText?: string,
  lowDiffText?: string,
  useLong?: boolean
}

export const RelativeTime = (date1?: Date, date2?: Date, custom?: RelativeTimeCustom) => {

  const props = {
    custom: {
      agoText: custom?.agoText ?? "ago",
      inText: custom?.inText ?? "in",
      lowDiffText: custom?.lowDiffText ?? "now",
      useLong: custom?.useLong ?? false
    } as RelativeTimeCustom
  }

  if (!date1 || !date2) {
    return props.custom.lowDiffText
  }
  const diff = date1.getTime() - date2.getTime();



  if (Math.abs(diff) <= TimeUnit.m) {
    return props.custom.lowDiffText
  }

  const unit = (Object.keys(TimeUnit) as TimeUnit[]).sort((a, b) => TimeUnit[a] - TimeUnit[b]).findLast((unit) => TimeUnit[unit] <= Math.abs(diff))

  if (!unit) {
    return `${diff}${props.custom.useLong ? " " + plural(TimeLongUnit.ms, diff) : "ms"}`
  }

  const rounded = Math.abs(Math.floor(diff / TimeUnit[unit]))

  return `${diff > 0 ? `${props.custom.inText} ` : ""}${rounded}${props.custom.useLong ? " " + plural(TimeLongUnit[unit], rounded) : unit
    }${diff <= 0 ? ` ${props.custom.agoText}` : ""}`
}

export function timeDiff(date1: Date, date2: Date) {
  return date1.getTime() - date2.getTime()
}


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

    lessThan(than: string | number) {
      validation.push(props.every((p) => ["number", "string"].includes(typeof p) ? (p as string | number) < than : false));
      return validation.every(Boolean);
    },

    moreThan(than: string | number) {
      validation.push(props.every((p) => ["number", "string"].includes(typeof p) ? (p as string | number) > than : false));
      return validation.every(Boolean);
    },

    lessEqThan(than: string | number) {
      validation.push(props.every((p) => ["number", "string"].includes(typeof p) ? (p as string | number) <= than : false));
      return validation.every(Boolean);
    },

    moreEqThan(than: string | number) {
      validation.push(props.every((p) => ["number", "string"].includes(typeof p) ? (p as string | number) >= than : false));
      return validation.every(Boolean);
    },

    custom(f: (prop: any) => boolean) {
      validation.push(...props.map((p) => f(p)));
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

export function Utf8ToHex(utf8: string) {
  return Buffer.from(utf8, "utf8").toString("hex");
}

export function HexToUtf8(hex: string) {
  return Buffer.from(hex, "hex").toString("utf8");
}


export function uuid() {
  return uuidv4();
}
