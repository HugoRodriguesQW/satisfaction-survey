import type { TransactionSchema } from "./server/database.d";


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

