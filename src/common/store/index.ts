import { TOKEN_KEY, CSRF_KEY, Token } from '@constants';

export const getToken = (): Token => {
  return { csrf: window.sessionStorage.getItem(CSRF_KEY), token: window.sessionStorage.getItem(TOKEN_KEY) };
};

export const saveToken = ({ token, csrf }: Token) => {
  window.sessionStorage.setItem(TOKEN_KEY, token);
  window.sessionStorage.setItem(CSRF_KEY, csrf);
};

export const destroyToken = () => {
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(CSRF_KEY);
};

export default { getToken, saveToken, destroyToken };
