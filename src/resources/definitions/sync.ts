export const Sync = {
    Fail: 0,
    Ok: 1,
    Syncing: 2
} as const;
export type Sync = typeof Sync[keyof typeof Sync];
