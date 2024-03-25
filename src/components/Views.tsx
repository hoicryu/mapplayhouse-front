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
import menu_category from '@assets/icons/menu_category.png';
import menu_like from '@assets/icons/menu_like.png';
import menu_home from '@assets/icons/menu_home.png';
import menu_mypage from '@assets/icons/menu_mypage.png';
import menu_like_selected from '@assets/icons/menu_like_selected.png';
import menu_home_selected from '@assets/icons/menu_home_selected.png';
import menu_mypage_selected from '@assets/icons/menu_mypage_selected.png';

const F7Views = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentUser, isAuthenticated, authenticateUser, unAuthenticateUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<'신청하기' | '예약하기' | '홈' | 'MY'>('홈');
  const signInHomeActive = [
    ['#view-home', menu_home, '홈', menu_home_selected],
    ['#view-categories', menu_category, '신청하기', menu_category],
    ['#view-likes', menu_like, '예약하기', menu_like_selected],
    ['#view-mypage', menu_mypage, 'MY', menu_mypage_selected],
  ];

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
    console.log(window.location, 'kkkkk');
    if (!isAuthenticated) {
      // f7.views.main.router.navigate('/users/sign_in');
    }
  }, []);

  const loggedInViews = () => (
    <Views tabs className="safe-areas relative">
      <CustomToast />
      <Toolbar tabbar labels bottom>
        {signInHomeActive.map((tab, idx) => (
          <Link
            key={idx}
            tabLink={tab[0]}
            tabLinkActive={currentTab === tab[2]}
            onClick={() => {
              // eslint-disable-next-line no-unused-expressions
              currentTab === tab[2] && f7.views.current.router.back();
              setCurrentTab(tab[2]);
            }}
          >
            <img src={currentTab === tab[2] ? tab[3] : tab[1]} alt="" width="28" />
            <span className="tabbar-label">{tab[2]}</span>
          </Link>
        ))}
      </Toolbar>
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
          // setCurrentTab('홈');
        }}
        url="/"
        iosDynamicNavbar={false}
      />
      <View
        id="view-mypage"
        onTabShow={() => {
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
