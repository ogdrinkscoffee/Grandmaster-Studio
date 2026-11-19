/// <reference lib="webworker" />
import { EngineRequest, runEngineRequest } from './engineOps';

// Runs engine search/analysis off the UI thread so the board stays at 60fps.
self.onmessage = (event: MessageEvent<{ id: number; req: EngineRequest }>) => {
  const { id, req } = event.data;
  try {
    const result = runEngineRequest(req);
    (self as unknown as Worker).postMessage({ id, result });
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, error: err instanceof Error ? err.message : String(err) });
  }
};
