import * as Comlink from "comlink";

export interface WorkerAPI {
  echo(message: string): Promise<string>;
}

const worker = new SharedWorker(new URL("./worker.ts", import.meta.url), {
  type: "module",
  name: "shared-worker-network-rpc",
});

worker.port.start();

export const workerAPI = Comlink.wrap<WorkerAPI>(worker.port);
