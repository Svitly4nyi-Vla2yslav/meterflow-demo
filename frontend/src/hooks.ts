import { useCallback, useEffect, useState } from 'react';

export function useApiData<T>(loader: () => Promise<T>, dependencies: readonly unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setData(await loader()); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Ein unbekannter Fehler ist aufgetreten.'); }
    finally { setLoading(false); }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { void load(); }, [load]);
  return { data, loading, error, retry: load };
}
