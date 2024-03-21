import React, { useEffect, useState } from 'react';
import { f7, Views, View, Toolbar, Link } from 'framework7-react';
import useAuth from '@hooks/useAuth';
import { destroyToken, getToken, saveToken } from '@store';
import { sleep } from '@utils/index';
import { useRecoilState } from 'recoil';
import { currentMarketId } from '@atoms';
import { useQueryClient } from 'react-query';
import CustomToast from './shared/CustomToast';
import { refresh } from '@api';

const F7Views = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentUser, isAuthenticated, authenticateUser, unAuthenticateUser } = useAuth();

  useEffect(() => {
    (async function checkToken() {
      try {
        if (getToken().csrf && getToken().token) {
          authenticateUser(getToken());
        } else {
          // TODO Check Token 구현 필요

          const response = await refresh();
          saveToken(response.data);
        }
      } catch {
        destroyToken();
        unAuthenticateUser();
      } finally {
        await sleep(700);
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (window.location.hash && !isAuthenticated && !window.location.hash.startsWith('#/')) {
      f7.views.main.router.navigate('/users/sign_in');
    }
  }, []);

  const loggedInViews = () => (
    <Views tabs className="safe-areas relative">
      <CustomToast />
      <Toolbar tabbar labels bottom></Toolbar>
      <div>test</div>
      <View
        // onTabShow={() => queryClient.invalidateQueries('likedTargets')}
        id="view-categories"
        stackPages
        name="items"
        tab
        url="/categories"
      />
      <View
        // onTabShow={() => queryClient.invalidateQueries('likedTargets')}
        id="view-home"
        stackPages
        main
        tab
        tabActive
        onTabShow={() => {
          setCurrentTab('홈');
        }}
        url="/"
        iosDynamicNavbar={false}
      />
      <View
        id="view-mypage"
        onTabShow={() => {
          queryClient.invalidateQueries('orderLists');
          queryClient.invalidateQueries('likedTargets');

          // setCurrentTab('MY');
        }}
        stackPages
        name="mypage"
        tab
        url="/mypage"
      />
    </Views>
  );

  return loggedInViews();
};

export default F7Views;
