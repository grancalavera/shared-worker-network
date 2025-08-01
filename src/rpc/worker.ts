import * as Comlink from "comlink";

class WorkerAPI {
  private echoCount = 0;

  echo(message: string): string {
    this.echoCount++;
    console.log(`Worker received: ${message}`);
    return `WORKER #${this.echoCount}: ${message}`;
  }
}

const api = new WorkerAPI();

self.addEventListener("connect", (event: any) => {
  const port = event.ports[0];
  port.start();
  Comlink.expose(api, port);
});
