import type { User } from '../types';

/**
 * Формує дволітерні ініціали користувача для аватара без зміни вхідного об’єкта.
 * @param user — об’єкт, від якого потрібні лише firstName і lastName.
 * @returns Перші UTF-16 символи імені та прізвища, приведені до верхнього регістру; порожнє поле дає порожню частину.
 */
export const getInitials = (user: Pick<User, 'firstName' | 'lastName'>) => `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

/**
 * Вибирає німецьке привітання за локальною годиною переданої дати.
 * @param date — дата для визначення часу; без аргументу створюється поточний локальний момент.
 * @returns 'Guten Morgen' для 05:00–11:59, 'Guten Tag' для 12:00–17:59, інакше 'Guten Abend'.
 */
export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Guten Morgen';
  if (hour >= 12 && hour < 18) return 'Guten Tag';
  return 'Guten Abend';
}
export const roleLabels = { DEVELOPER: 'Developer', ADMIN: 'Administrator' } as const;
