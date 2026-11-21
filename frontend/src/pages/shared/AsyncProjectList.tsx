import { useCallback } from 'react';
import { EmptyState, ErrorState, LoadingState } from '../../components/AsyncState';
import { ProjectTable } from '../../components/ProjectTable';
import { useApiData } from '../../hooks';
import { api } from '../../services/api';

/**
 * Завантажує проєкти та повертає відповідний стан: очікування, помилку з повтором, порожній список або таблицю.
 * @param limit — необов’язкова максимальна кількість перших проєктів; `slice` не змінює відповідь API.
 * @sideEffects `useApiData` запускає HTTP-запит через стабільний loader і може повторити його через `retry`.
 */
export function AsyncProjectList({ limit }: { limit?: number }) {
  // Порожній список залежностей зберігає посилання на loader між рендерами й запобігає зайвим перезапускам ефекту.
  const loader = useCallback(() => api.getProjects(), []);
  const { data, loading, error, retry } = useApiData(loader, [loader]);
  if (loading) return <LoadingState label="Projekte werden geladen …" />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!data?.length) return <EmptyState message="Noch keine Projekte vorhanden." />;
  return <ProjectTable projects={typeof limit === 'number' ? data.slice(0, limit) : data} />;
}
