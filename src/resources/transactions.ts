import type { TransactionSchema } from "./server/database.d";
import type { WithId } from "mongodb";
import { SafeObject } from "./utils";

export type Transaction = {
  id: string;
  tasks: { name: string; done: TransactionSchema["tasks"][number]["done"] }[];
};

export function isDone(tasks: Transaction["tasks"] | TransactionSchema["tasks"]) {
  return tasks.every((task) => task.done);
}

export function nextTask(tasks: Transaction["tasks"] | TransactionSchema["tasks"]) {
  return tasks.find((task) => !task.done);
}

export function SafeTransaction(transaction: WithId<TransactionSchema>) {
  const safe: Transaction = {
    id: transaction._id.toHexString(),
    tasks: transaction.tasks.map((task) => SafeObject(task, { name: 1, done: 1 })),
  };

  return safe;
}
