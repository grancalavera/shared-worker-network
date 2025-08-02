import * as Comlink from "comlink";
import type { WorkerAPI as IWorkerAPI } from "./types.js";

declare const self: SharedWorkerGlobalScope;

class WorkerAPI implements IWorkerAPI {
  private echoCount = 0;

  async echo(message: string): Promise<string> {
    this.echoCount++;
    console.log(`Worker received: ${message}`);
    return `WORKER #${this.echoCount}: ${message}`;
  }
}

const api = new WorkerAPI();

self.addEventListener("connect", (event) => {
  const port = event.ports[0];
  port.start();
  Comlink.expose(api, port);
});
