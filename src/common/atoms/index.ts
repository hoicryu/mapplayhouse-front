import { atom } from 'recoil';
import { AuthState, CurrentUser, CustomToastProps } from '@constants';

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

export const userLikes = atom<UserLikesProps>({
  key: 'userLikes',
  default: {},
});

export const lineItemsSum = atom<number>({
  key: 'lineItems',
  default: 0,
});

export const currentMarketId = atom<number>({
  key: 'marketId',
  default: null,
});

export const LineItemMarketId = atom<number>({
  key: 'LineItemMarketId',
  default: null,
});

export const marketLikes = atom<number>({
  key: 'marketkLikes',
  default: null,
});

export const userLatitude = atom<number>({
  key: 'userLatitude',
  default: 37.542065284822364,
});

export const userLongitude = atom<number>({
  key: 'userLongitude',
  default: 127.04965159096558,
});

export const marketReviewCount = atom<number>({
  key: 'marketReviewCount',
  default: 0,
});

export const unwrittenReviewCount = atom<number>({
  key: 'unwrittenReviewCount',
  default: 0,
});

export const couponCount = atom<number>({
  key: 'couponCount',
  default: 0,
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
