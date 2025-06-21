type Stack<T extends string> = {
    [stackId in T]: NodeJS.Timeout | null;
}

type Callback<T> = (update: unknown, stackId: T) => void | Promise<void>

type StackCallbacks<T extends string> = {
    [stackId in T | "fail" | "success"]: Callback<T>[]
}

type StackConfig = {
    timeout: number
}

export function createUpdateStack<T extends string>(...stacksIds: T[]) {

    const stack = {} as Stack<T>
    const listeners = [] as StackCallbacks<T>
    const events = [] as Promise<void>[]

    stacksIds.map((id) => {
        listeners[id] = [] as Callback<T>[];
        stack[id] = null;
    })

    listeners["success"] = [] as Callback<T>[];
    listeners["fail"] = [] as Callback<T>[];

    const config: StackConfig = {
        timeout: 500
    }

    function push(stackId: T, update: unknown) {
        if (stacksIds.includes(stackId)) {

            if (stack[stackId]) {
                clearTimeout(stack[stackId]);
                stack[stackId] = null;
            }

            stack[stackId] = setTimeout(() => {
                listeners[stackId].forEach((c) => call(stackId, c, update))
            }, config.timeout);
        }
    }

    function call(stackId: T, callback: Callback<T>, update: unknown) {
        events.push(
            new Promise((next) => {
                Promise.all(events).finally(() => {
                    Promise.resolve(callback(update, stackId))
                        .then(() => {
                            listeners["success"].forEach((c) => c(update, stackId))
                        }).catch(() => {
                            listeners["fail"].forEach((c) => c(update, stackId))
                        }).finally(() => {
                            next();
                            events.shift();
                        })
                })
            })
        )
    }

    function on(stackId: T | "fail" | "error", callback: Callback<T>) {
        if ([...stacksIds, "fail", "error"].includes(stackId)) {
            listeners[stackId as T].push(callback);
        }
    }

    function off(stackId: T | "fail" | "error", callback: Callback<T>) {
        if ([...stacksIds, "fail", "error"].includes(stackId)) {
            const index = listeners[stackId as T].indexOf(callback);
            if (index !== -1) {
                listeners[stackId as T].splice(index, 1)
            }
        }
    }

    function setup(c?: Partial<StackConfig>) {
        Object.assign(config, c);
        return {
            push,
            stack,
            on,
            off
        }
    }

    return {
        setup,
        push,
        stack,
        on,
        off
    }
}