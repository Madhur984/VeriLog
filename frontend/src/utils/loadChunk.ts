/**
 * Resilient dynamic-import for React.lazy routes.
 *
 * Code-split chunks occasionally fail to load for transient reasons — a brief
 * network drop, or a chunk requested mid-flight right after navigation (e.g.
 * landing on /portal straight after sign-in, when the whole workstation chunk
 * graph is fetched for the first time). Without a retry, React.lazy throws and
 * — absent an error boundary — blanks the page, which is the classic
 * "it works after I reload" bug.
 *
 * This retries the import a couple of times with a short backoff before giving
 * up. Persistent failures (usually a stale chunk hash after a new deploy, or a
 * service-worker-cached old manifest) are handled one level up by
 * AppErrorBoundary, which reloads once to fetch the fresh asset manifest.
 */
export async function loadChunk<T>(factory: () => Promise<T>): Promise<T> {
  const MAX_RETRIES = 2;
  const BASE_DELAY = 350; // ms; grows linearly per attempt

  let lastErr: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await factory();
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, BASE_DELAY * (attempt + 1)));
      }
    }
  }
  throw lastErr;
}
