import type { User } from '../types';

export const getInitials = (user: Pick<User, 'firstName' | 'lastName'>) => `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Guten Morgen';
  if (hour >= 12 && hour < 18) return 'Guten Tag';
  return 'Guten Abend';
}
export const roleLabels = { DEVELOPER: 'Developer', ADMIN: 'Administrator' } as const;
