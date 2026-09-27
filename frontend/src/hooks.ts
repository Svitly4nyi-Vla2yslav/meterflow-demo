import { useCallback, useEffect, useState } from 'react';

/**
 * Завантажує дані через переданий асинхронний loader і надає стан для інтерфейсу.
 * T визначає тип результату; до першого успішного запиту data дорівнює null.
 * dependencies задає, коли потрібно створити нову функцію завантаження й повторити запит.
 * Передавай сюди значення, від яких залежить loader (наприклад, ідентифікатор проєкту).
 * retry дозволяє повторити запит вручну з тими самими залежностями.
 */
export function useApiData<T>(loader: () => Promise<T>, dependencies: readonly unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Починає запит і прибирає попередню помилку. Наявні data зберігаються,
  // доки loader не поверне новий результат; помилка також не очищує попередні дані.
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setData(await loader()); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Ein unbekannter Fehler ist aufgetreten.'); }
    finally { setLoading(false); }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  // Запускає завантаження після монтування та при зміні load через dependencies.
  // void позначає, що ефект не повертає Promise: помилка loader обробляється в load.
  useEffect(() => { void load(); }, [load]);
  return { data, loading, error, retry: load };
}
