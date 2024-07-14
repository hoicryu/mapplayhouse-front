import jwt_decode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { f7, Views, View, Toolbar, Link } from 'framework7-react';
import useAuth from '@hooks/useAuth';
import { destroyToken, getToken, saveToken } from '@store';
import { sleep } from '@utils/index';
import CustomToast from './shared/CustomToast';
import { refresh } from '@api';
import { IoHomeOutline, IoHome, IoCalendarOutline, IoCalendarSharp, IoPersonOutline, IoPerson } from 'react-icons/io5';
import { RiInboxUnarchiveLine } from 'react-icons/ri';

const F7Views = () => {
  const { authenticateUser, unAuthenticateUser, currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('홈');

  const signInTab = [
    {
      id: 'view-home',
      title: '홈',
      img: IoHome,
      actImg: IoHomeOutline,
    },
    {
      id: 'view-groups',
      title: '참여',
      img: RiInboxUnarchiveLine,
      actImg: RiInboxUnarchiveLine,
    },
    {
      id: 'view-reservations',
      title: '예약',
      img: IoCalendarSharp,
      actImg: IoCalendarOutline,
    },
    {
      id: 'view-mypage',
      title: 'MY',
      img: IoPerson,
      actImg: IoPersonOutline,
    },
  ];

  function isExpired() {
    const expTime = new Date(jwt_decode(getToken().token)['exp'] * 1000);
    const now = new Date();
    const diffMSec = expTime.getTime() - now.getTime();
    const expired = diffMSec < 0;
    return expired;
  }

  useEffect(() => {
    (async function checkToken() {
      try {
        if (getToken().csrf && getToken().token) {
          if (isExpired()) {
            const response = await refresh();
            if (response.data) saveToken(response.data);
          } else {
            authenticateUser(getToken());
          }
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

  function exportComponent(compo) {
    const Component = compo;
    return <Component size={23} />;
  }

  const loggedInViews = () => (
    <Views tabs className="safe-areas relative">
      <CustomToast />
      <Toolbar tabbar labels bottom>
        {signInTab.map((tab, idx) => (
          <Link
            key={`link${idx}`}
            tabLink={`#${tab.id}`}
            tabLinkActive={currentTab === tab.title}
            onClick={() => {
              currentTab === tab.title && f7.views.current.router.back();
              setCurrentTab(tab.title);
            }}
          >
            <div className="flex flex-col justify-center items-center">
              {currentTab === tab.title ? exportComponent(tab.img) : exportComponent(tab.actImg)}
              <span className="tabbar-label">{tab.title}</span>
            </div>
          </Link>
        ))}
      </Toolbar>
      {signInTab.map((tab, idx) => (
        <View
          key={`view${idx}`}
          id={tab.id}
          onTabShow={() => {
            setCurrentTab(tab.title);
          }}
          stackPages
          main={idx === 0 ? true : false}
          tab
          tabActive={idx === 0 ? true : false}
          url={idx === 0 ? '/' : `/${tab.id.replace('view-', '')}`}
          name={tab.id.replace('view-', '')}
        />
      ))}
    </Views>
  );

  return loggedInViews();
};

export default F7Views;
