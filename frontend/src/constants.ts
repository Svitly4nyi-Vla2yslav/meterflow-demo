import type { ProjectStatus } from './types';

export const workflowStages: { status: ProjectStatus; label: string }[] = [
  { status: 'INQUIRY', label: 'Anfrage' },
  { status: 'ECONOMIC_CHECK', label: 'Wirtschaftlichkeitsprüfung' },
  { status: 'CONTRACT', label: 'Vertrag' },
  { status: 'METERING_CONCEPT', label: 'Messkonzept' },
  { status: 'GRID_REGISTRATION', label: 'Anmeldung Netzbetreiber' },
  { status: 'INSTALLATION', label: 'Installation' },
  { status: 'COMMISSIONING', label: 'Inbetriebnahme' },
  { status: 'BILLING', label: 'Abrechnung' },
  { status: 'COMPLETED', label: 'Abgeschlossen' },
];

export function getProjectPhase(status: ProjectStatus) {
  if (status === 'COMPLETED') return 'Abgeschlossen';
  if (['INSTALLATION', 'COMMISSIONING', 'BILLING'].includes(status)) return 'In Umsetzung';
  return 'In Planung';
}

export function getProgress(status: ProjectStatus) {
  const index = workflowStages.findIndex((stage) => stage.status === status);
  return Math.round(((index + 1) / workflowStages.length) * 100);
}
