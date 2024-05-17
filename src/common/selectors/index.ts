import _ from 'lodash';
import { selector, selectorFamily } from 'recoil';
import { AuthState } from '@constants';
import { authState, groupsState } from '@atoms';

export const authSelector = selector({
  key: 'authSelector',
  get: ({ get }) => get(authState),
  set: ({ set }, newAuthState: AuthState) => set(authState, newAuthState),
});

// export const getLikeIds = selectorFamily({
//   key: 'likeIds',
//   get: (model_name: string) => ({ get }) => {
//     const likes = get(userLikes);
//     return likes[model_name] || [];
//   },
// });
