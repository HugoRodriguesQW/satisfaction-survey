export const STATUS = {
  disabled: 0,
  scheduled: 1,
  active: 2,
  ended: 3,
} as const;

export type STATUS = keyof typeof STATUS;
export type STATUSValue = (typeof STATUS)[keyof typeof STATUS]
