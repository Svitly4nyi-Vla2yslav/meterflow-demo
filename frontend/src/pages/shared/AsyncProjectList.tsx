import { useCallback } from 'react';
import { EmptyState, ErrorState, LoadingState } from '../../components/AsyncState';
import { ProjectTable } from '../../components/ProjectTable';
import { useApiData } from '../../hooks';
import { api } from '../../services/api';

export function AsyncProjectList({ limit }: { limit?: number }) {
  const loader = useCallback(() => api.getProjects(), []);
  const { data, loading, error, retry } = useApiData(loader, [loader]);
  if (loading) return <LoadingState label="Projekte werden geladen …" />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!data?.length) return <EmptyState message="Noch keine Projekte vorhanden." />;
  return <ProjectTable projects={typeof limit === 'number' ? data.slice(0, limit) : data} />;
}
