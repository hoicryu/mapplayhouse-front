import { useRecoilState } from 'recoil';
import { AuthState, Token } from '@constants';
import { getCurrentUserFromToken } from '@utils';
import { destroyToken, saveToken } from '@store';
import { authSelector } from '@selectors';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useRecoilState<AuthState>(authSelector);

  const authenticateUser = ({ token, csrf }: Token) => {
    saveToken({ token, csrf });
    setCurrentUser({ token, csrf, currentUser: getCurrentUserFromToken(token) });
  };

  const unAuthenticateUser = () => {
    destroyToken();
    setCurrentUser({ token: null, csrf: null, currentUser: null });
  };

  return {
    ...currentUser,
    authenticateUser,
    unAuthenticateUser,
    isAuthenticated: !!currentUser.token && !!currentUser.csrf,
  };
};

export default useAuth;
