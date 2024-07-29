import React, { useCallback } from 'react';
import { Navbar, NavTitle, Page } from 'framework7-react';
import BackLinkNav from '@components/shared/BackLinkNav';
import useAuth from '@hooks/useAuth';
import { logoutAPI } from '@api';
const SettingPage = () => {
  const { isAuthenticated, unAuthenticateUser } = useAuth();

  const logoutHandler = useCallback(async () => {
    try {
      await logoutAPI();
    } finally {
      unAuthenticateUser();
    }
    window.location.reload();
  }, [unAuthenticateUser]);

  return (
    <Page>
      <BackLinkNav title={'설정'} />
      {isAuthenticated && (
        <ul className="mt-2">
          <li>
            <a href="/users/edit" className="block hover:bg-gray-50">
              <div className="px-5 py-4 flex justify-between items-center">
                <p className="text-sm font-base text-theme-black truncate">회원 정보 수정</p>
                <i
                  className="las la-angle-right"
                  style={{ fontSize: '21px', color: 'gray', textShadow: '0.3px 0 0 gray, -0.3px 0 0 gray' }}
                />
              </div>
            </a>
          </li>
          <li>
            <a href="#" onClick={logoutHandler} className="block hover:bg-gray-50">
              <div className="px-5 py-4 flex items-center">
                <p className="text-sm font-base text-theme-black truncate">로그아웃</p>
              </div>
            </a>
          </li>
        </ul>
      )}
    </Page>
  );
};

export default React.memo(SettingPage);
