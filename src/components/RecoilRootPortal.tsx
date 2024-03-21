import React from 'react';
import { Loadable, RecoilState, RecoilValue, useRecoilCallback, useRecoilTransactionObserver_UNSTABLE } from 'recoil';
import { destroyToken, saveToken } from '@store';
import { getCurrentUserFromToken } from '@utils';
import { Token } from '@constants';
import { authState } from '@atoms';

export let getRecoilRootState: <T>(recoilValue: RecoilValue<T>) => Loadable<T> = () => null as any;

export let setRecoilRootState: <T>(recoilState: RecoilState<T>, valOrUpdater: ((currVal: T) => T) | T) => void = () =>
  null as any;

export function RecoilRootPortal() {
  useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
    getRecoilRootState = snapshot.getLoadable;
  });

  useRecoilCallback(({ set }) => {
    setRecoilRootState = set;
    return async () => {};
  })();

  return <></>;
}

export const unAuthenticateUserThroughPortal = () => {
  destroyToken();
  setRecoilRootState(authState, { token: null, csrf: null, currentUser: null });
  console.log('유저 인증 실패!');
};

export const authenticateUserThroughPortal = ({ token, csrf }: Token) => {
  try {
    saveToken({ token, csrf });
    setRecoilRootState(authState, { token, csrf, currentUser: getCurrentUserFromToken(token) });
    console.log('유저 인증 성공~!');
  } catch (err) {
    unAuthenticateUserThroughPortal();
  }
};
