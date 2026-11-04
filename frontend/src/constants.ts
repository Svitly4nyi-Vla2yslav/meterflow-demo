import type { ProjectStatus } from './types';

// Порядок елементів є канонічним порядком workflow та використовується для обчислення прогресу.
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

/**
 * Зводить детальний статус проєкту до однієї з трьох оглядових фаз.
 * Функція не змінює статус і повертає готовий німецький підпис для інтерфейсу.
 */
export function getProjectPhase(status: ProjectStatus) {
  if (status === 'COMPLETED') return 'Abgeschlossen';
  if (['INSTALLATION', 'COMMISSIONING', 'BILLING'].includes(status)) return 'In Umsetzung';
  return 'In Planung';
}

/**
 * Повертає округлений відсоток проходження workflow за позицією статусу в `workflowStages`.
 * Перший етап уже має ненульовий прогрес, а `COMPLETED` дає 100%.
 */
export function getProgress(status: ProjectStatus) {
  const index = workflowStages.findIndex((stage) => stage.status === status);
  return Math.round(((index + 1) / workflowStages.length) * 100);
}
