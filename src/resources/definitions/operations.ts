export const Operations = {
  sum: (...numbers: number[]) => numbers.reduce((a, b) => a + b, 0),
  mean: (...numbers: number[]) => (numbers.length === 0 ? 0 : numbers.reduce((a, b) => a + b, 0) / numbers.length),
  mul: (...numbers: number[]) => numbers.reduce((a, b) => a * b, 1),
  min: (...numbers: number[]) => (numbers.length === 0 ? 0 : Math.min(...numbers)),
  max: (...numbers: number[]) => (numbers.length === 0 ? 0 : Math.max(...numbers)),
  normalize: (real: number[], total: number[]) => {
    const totalSum = Operations.sum(...total);
    return totalSum === 0 ? 0 : Operations.sum(...real) / totalSum;
  },
  rms: (...numbers: number[]) =>
    numbers.length === 0 ? 0 : Math.sqrt(numbers.reduce((sum, val) => sum + val ** 2, 0) / numbers.length),
} as const;

export type Operations = keyof typeof Operations;
