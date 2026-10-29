const TOKEN_KEY = 'meterflow_access_token';
let unauthorizedHandler: (() => void) | null = null;

/** Повертає access token із localStorage або null; сховище та callback-стан не змінює. */
export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
/**
 * Зберігає access token поточної сесії та повертає void.
 * @param token — JWT, отриманий після автентифікації.
 * @sideEffects Перезаписує єдиний ключ meterflow_access_token у localStorage.
 */
export const saveAccessToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
/** Видаляє ключ токена з localStorage, нічого не повертаючи й не викликаючи unauthorized-handler. */
export const clearAccessToken = () => localStorage.removeItem(TOKEN_KEY);
/**
 * Замінює модульний callback для централізованої реакції на 401 і повертає void.
 * @param handler — функція без аргументів або null для скидання; попередній callback не викликається.
 */
export const setUnauthorizedHandler = (handler: (() => void) | null) => { unauthorizedHandler = handler; };
/** Синхронно викликає поточний unauthorized-handler без аргументів; за його відсутності нічого не робить. */
export const notifyUnauthorized = () => unauthorizedHandler?.();
