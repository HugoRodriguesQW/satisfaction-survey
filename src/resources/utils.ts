/* eslint-disable @typescript-eslint/no-explicit-any */

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

export function randomSalt() {
    const now = Date.now();
    const seed = now ^ (now >>> 3); // bagunça um pouco o timestamp
    const fraction = (seed / 1000) % 1;
    const salt = Math.floor(fraction * 10) + 10; // entre 10 e 19
    return salt;
  }