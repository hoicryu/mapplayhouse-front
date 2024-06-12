import { atom } from 'recoil';
import { AuthState, CurrentUser, CustomToastProps, Groups, TimeList, Reservation } from '@constants';

const initialAuthState: AuthState = {
  token: null,
  csrf: null,
  currentUser: null,
};

export const authState = atom<AuthState>({
  key: 'authState',
  default: initialAuthState,
});

const initialCurrentUser: CurrentUser = {
  email: '',
  isAuthenticated: false,
};

export const currentUserState = atom<CurrentUser>({
  key: 'currentUser',
  default: initialCurrentUser,
});

export const groupsState = atom<Groups>({
  key: 'groups',
  default: {
    groups: [],
    isError: false,
    isSuccess: false,
  },
});

export const customToastState = atom<CustomToastProps>({
  key: 'customToastState',
  default: {
    open: false,
    content: '',
    img: '',
    position: 'end',
  },
});

export const timeListState = atom<TimeList[]>({
  key: 'timeLists',
  default: [],
});

export const reservationState = atom<Reservation[]>({
  key: 'reservaions',
  default: [],
});
