const TOKEN_KEY = 'meterflow_access_token';
let unauthorizedHandler: (() => void) | null = null;

/** Повертає збережений access token або null, якщо сесії немає. */
export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
/**
 * Зберігає access token поточної сесії.
 * @param token — JWT, отриманий після автентифікації.
 * @sideEffects Записує значення до localStorage.
 */
export const saveAccessToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
/** Видаляє access token із localStorage під час виходу або втрати авторизації. */
export const clearAccessToken = () => localStorage.removeItem(TOKEN_KEY);
/**
 * Реєструє callback для централізованої реакції на відповідь 401.
 * @param handler — функція обробки або null для скидання.
 */
export const setUnauthorizedHandler = (handler: (() => void) | null) => { unauthorizedHandler = handler; };
/** Викликає зареєстрований unauthorized-handler, якщо він наявний. */
export const notifyUnauthorized = () => unauthorizedHandler?.();
