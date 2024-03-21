import { TOKEN_KEY, CSRF_KEY, Token } from '@constants';

export const getToken = (): Token =>
  window.localStorage.getItem('rememberMe')
    ? {
        csrf: window.localStorage.getItem(CSRF_KEY),
        token: window.localStorage.getItem(TOKEN_KEY),
      }
    : {
        csrf: window.sessionStorage.getItem(CSRF_KEY),
        token: window.sessionStorage.getItem(TOKEN_KEY),
      };

export const saveToken = ({ token, csrf }: Token) => {
  if (window.localStorage.getItem('rememberMe')) {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(CSRF_KEY, csrf);
  } else {
    window.sessionStorage.setItem(TOKEN_KEY, token);
    window.sessionStorage.setItem(CSRF_KEY, csrf);
  }
};

export const destroyToken = () => {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(CSRF_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(CSRF_KEY);
};

export default { getToken, saveToken, destroyToken };
