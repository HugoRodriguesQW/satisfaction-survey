type Stack<T extends string> = {
    [stackId in T]: NodeJS.Timeout | null;
}

type Callback<T> = (update: unknown, stackId: T) => void | Promise<void>


type StackCallbacks<T extends string> = {
    [stackId in T | internalIds]: Callback<T>[]
}

type StackConfig = {
    timeout: number
}

const internalIds = ["fail", "success", "call"] as const;
type internalIds = typeof internalIds[number];

export function createUpdateStack<T extends string>(...stacksIds: T[]) {

    const stack = {} as Stack<T>
    const listeners = [] as StackCallbacks<T>
    const events = [] as Promise<void>[]
    const fails = {} as { [id in T]: { callback: Callback<T>, update: unknown } }

    stacksIds.map((id) => {
        listeners[id] = [] as Callback<T>[];
        stack[id] = null;
    })

    listeners["success"] = [] as Callback<T>[];
    listeners["fail"] = [] as Callback<T>[];
    listeners["call"] = [] as Callback<T>[];

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
                    listeners["call"].forEach((c) => c(update, stackId))
                    Promise.resolve(callback(update, stackId))
                        .then(() => {
                            listeners["success"].forEach((c) => c(update, stackId))
                        }).catch(() => {
                            fails[stackId] = { callback, update }
                            listeners["fail"].forEach((c) => c(update, stackId))
                        }).finally(() => {
                            next();
                            events.shift();
                        })
                })
            })
        )
    }

    function retry(stackId?: T) {
        if (stackId && fails[stackId]) {
            call(stackId, fails[stackId].callback, fails[stackId].update)
        }
        for (const id in fails) {
            call(id, fails[id].callback, fails[id].update)
        }
    }

    function on(stackId: T | internalIds, callback: Callback<T>) {
        if ([...stacksIds, ...internalIds].includes(stackId)) {
            listeners[stackId as T].push(callback);
        }
    }

    function off(stackId: T | internalIds, callback: Callback<T>) {
        if ([...stacksIds, ...internalIds].includes(stackId)) {
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
            off,
            retry
        }
    }

    return {
        setup,
        push,
        stack,
        on,
        off,
        retry
    }
}