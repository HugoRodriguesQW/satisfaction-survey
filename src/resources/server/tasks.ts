
import bcrypt from "bcrypt";
import crypto from "crypto";
import { TaskName, TransactionSchema } from "./database.d";
import { decrypt, encrypt, Hash, randomBytes } from "./crypto";
import { SafeObject } from "../utils";

type CompoundLayer = {
    meta: string,
    layer: number
}

export class Compound<C extends { done: boolean }> {
    private list: C[]
    private metadata?: string;
    private raw?: string;

    constructor(list: C[]) {
        this.list = list;
    }

    attach(data: object | string | number | boolean) {
        this.metadata = JSON.stringify(data)
        return this;
    }

    attachRaw(raw: string) {
        this.raw = raw
        return this;
    }

    next() {
        return this.list.find((item) => !item.done)
    }

    map<T>(mapFn: (value: C, index?: number, array?: C[]) => T) {
        return this.list.map(mapFn) as T[]
    }

    done() {
        return this.list.every((item) => item.done)
    }

    static TaskStack(tasks: Task[]) {
        class CompoundTask extends Compound<Task> {
            private encrypted?: string;

            constructor(list: Task[]) {
                super(list)

            }

            mount() {
                if (!this.metadata) throw new Error("Attach the data before mount the compound stack")
                const stackSize = this.list.length;
                return this.list.reduceRight((meta, task, index) => {
                    if (!task.revealSecret()) throw new Error("Missing Task secret, cannot mount the stack.")
                    return encrypt({ meta, layer: stackSize - index - 1 } as CompoundLayer,
                        new Hash(task.revealSecret() as string).withSecret()
                    )
                }, this.metadata)
            }

            unmount(secret: string): CompoundLayer | false {
                if (!this.raw) throw new Error("Attach a raw data before unmount the compound stack")
                return decrypt(this.raw, new Hash(secret).withSecret())
            }

            getTask(nameOrIndex: TaskName | number, callback: (task?: Task) => Promise<void> | void) {
                return Promise.resolve(callback(this.list.find((t, index) => typeof nameOrIndex === "string" ? t.name === nameOrIndex : index === nameOrIndex)))
            }
        }
        return new CompoundTask(tasks)
    }
}


type TaskOptions = {
    customMeta?: string
}

type TaskInput = {
    name: TaskName;
    done?: boolean;
    secret?: string;
}

export class Task {
    name: TaskName;
    done: boolean;
    meta: string;
    private secret?: string;

    constructor({ name, done = false, secret }: TaskInput, opt: TaskOptions = {}) {
        this.name = name;
        this.done = done;
        this.secret = secret;
        if (!opt.customMeta && !secret) throw new Error("The secret must be declared if no customMeta are in use")
        this.meta = opt.customMeta ? opt.customMeta : bcrypt.hashSync(secret as string, 10)
    }

    async test(data: string) {
        this.done = await bcrypt.compare(data, this.meta)
        return this.done;
    }

    revealSecret() {
        return this.secret;
    }

    static save(task: Task): TransactionSchema["tasks"][number] {
        return {
            done: task.done,
            name: task.name,
            meta: task.meta
        }
    }

    static safeSave(task: Task) {
        return SafeObject(task, { name: 1, done: 1 })
    }


    static from(raw: TransactionSchema["tasks"][number]) {
        return new Task({
            name: raw.name,
            done: raw.done
        }, {
            customMeta: raw.meta
        })
    }

    static RegisterEmailCheck() {
        const email_code = String(crypto.randomInt(1010, 9989));
        return new Task({ name: "register_email_check", secret: email_code })
    }

    static RecoveryEmailCheck() {
        const email_key = randomBytes(32);
        return new Task({ name: "recovery_email_check", secret: email_key })
    }

    static LoginValidation(email: string, password_hash?: string,) {
        return new Task({ name: "login_validation", secret: email },
            {
                customMeta: password_hash ?? bcrypt.hashSync(randomBytes(32), 10)
            })
    }
}