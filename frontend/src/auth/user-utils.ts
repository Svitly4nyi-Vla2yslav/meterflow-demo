import type { User } from '../types';

/**
 * Формує дволітерні ініціали користувача для аватара.
 *
 * @param user — ім'я та прізвище користувача.
 * @returns Перші літери імені й прізвища у верхньому регістрі.
 */
export const getInitials = (user: Pick<User, 'firstName' | 'lastName'>) => `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

/**
 * Вибирає німецьке привітання відповідно до локальної години.
 *
 * @param date — дата для визначення часу; типово поточний момент.
 * @returns Ранкове, денне або вечірнє привітання.
 */
export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Guten Morgen';
  if (hour >= 12 && hour < 18) return 'Guten Tag';
  return 'Guten Abend';
}
export const roleLabels = { DEVELOPER: 'Developer', ADMIN: 'Administrator' } as const;
