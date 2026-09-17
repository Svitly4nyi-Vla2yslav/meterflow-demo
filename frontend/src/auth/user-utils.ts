import type { User } from '../types';

export const getInitials = (user: Pick<User, 'firstName' | 'lastName'>) => `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
export const roleLabels = { DEVELOPER: 'Developer', ADMIN: 'Administrator' } as const;
