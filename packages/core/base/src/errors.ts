export class BridgeAdapterError extends Error {
  error: unknown;

  constructor(message: string | undefined, error?: unknown) {
    super(message);
    this.error = error;
  }
}
