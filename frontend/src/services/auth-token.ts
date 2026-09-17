const TOKEN_KEY = 'meterflow_access_token';
let unauthorizedHandler: (() => void) | null = null;

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const saveAccessToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearAccessToken = () => localStorage.removeItem(TOKEN_KEY);
export const setUnauthorizedHandler = (handler: (() => void) | null) => { unauthorizedHandler = handler; };
export const notifyUnauthorized = () => unauthorizedHandler?.();
