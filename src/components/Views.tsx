import React, { useEffect, useState } from 'react';
import { f7, Views, View, Toolbar, Link } from 'framework7-react';
import useAuth from '@hooks/useAuth';
import { destroyToken, getToken, saveToken } from '@store';
import { sleep } from '@utils/index';
import CustomToast from './shared/CustomToast';
import { refresh } from '@api';
import { IoHomeOutline, IoHome, IoCalendarOutline, IoCalendarSharp, IoPersonOutline, IoPerson } from 'react-icons/io5';
import { RiInboxUnarchiveLine, RiInboxUnarchiveFill } from 'react-icons/ri';

const F7Views = () => {
  const { authenticateUser, unAuthenticateUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<'홈' | '참여' | '예약' | 'MY'>('홈');
  const signInHomeActive = [
    // ['#view-home', IoHomeOutline, '홈', IoHome],
    // ['#view-groups', RiInboxUnarchiveLine, '참여', RiInboxUnarchiveLine],
    // ['#view-reservation', IoCalendarOutline, '예약', IoCalendarSharp],
    // ['#view-mypage', menu_mypage, 'MY', menu_mypage_selected],
  ];

  useEffect(() => {
    (async function checkToken() {
      try {
        if (getToken().csrf && getToken().token) {
          authenticateUser(getToken());
        } else {
          const response = await refresh();
          if (response.data) saveToken(response.data);
        }
      } catch {
        destroyToken();
        unAuthenticateUser();
      } finally {
        await sleep(700);
      }
    })();
  }, []);

  useEffect(() => {
    if (!(getToken().csrf && getToken().token)) {
      f7.views.main.router.navigate('/users/sign_in');
    }
  }, []);

  // Link 자손 중 이미지 컴포넌트 아웃풋하는 함수 만들기
  // function exportComponent(type){
  //   const Component = components[props.storyType];
  //   return <Component story={props.story} />;
  // }

  const loggedInViews = () => (
    <Views tabs className="safe-areas relative">
      <CustomToast />
      <Toolbar tabbar labels bottom>
        <Link
          tabLink={'#view-home'}
          tabLinkActive={currentTab === '홈'}
          onClick={() => {
            currentTab === '홈' && f7.views.current.router.back();
            setCurrentTab('홈');
          }}
        >
          <div className="flex flex-col justify-center items-center">
            {currentTab === '홈' ? <IoHome size={20} /> : <IoHomeOutline />}
            <span className="tabbar-label">홈</span>
          </div>
        </Link>
        <Link
          tabLink={'#view-groups'}
          tabLinkActive={currentTab === '참여'}
          onClick={() => {
            currentTab === '참여' && f7.views.current.router.back();
            setCurrentTab('참여');
          }}
        >
          {currentTab === '참여' ? <RiInboxUnarchiveFill /> : <RiInboxUnarchiveLine />}
          <span className="tabbar-label">참여</span>
        </Link>

        <Link
          tabLink={'#view-reservation'}
          tabLinkActive={currentTab === '예약'}
          onClick={() => {
            currentTab === '예약' && f7.views.current.router.back();
            setCurrentTab('예약');
          }}
        >
          {currentTab === '예약' ? <IoCalendarSharp /> : <IoCalendarOutline />}
          <span className="tabbar-label">예약</span>
        </Link>
        <Link
          tabLink={'#view-mypage'}
          tabLinkActive={currentTab === 'MY'}
          onClick={() => {
            currentTab === 'MY' && f7.views.current.router.back();
            setCurrentTab('MY');
          }}
        >
          {currentTab === 'MY' ? <IoPerson /> : <IoPersonOutline />}
          <span className="tabbar-label">MY</span>
        </Link>
      </Toolbar>
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
        id="view-groups"
        onTabShow={() => {
          setCurrentTab('참여');
        }}
        stackPages
        name="groups"
        tab
        url="/groups"
      />
      <View
        id="view-reservation"
        onTabShow={() => {
          setCurrentTab('예약');
        }}
        stackPages
        name="reservations"
        tab
        url="/reservations"
      />

      <View
        id="view-mypage"
        onTabShow={() => {
          setCurrentTab('MY');
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
