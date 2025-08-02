export interface WorkerAPI {
  echo(message: string): Promise<string>;
}
