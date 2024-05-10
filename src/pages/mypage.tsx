import React, { useCallback } from 'react';
import { Navbar, Page, NavTitle } from 'framework7-react';
import Footer from '@components/shared/Footer';
import { logoutAPI } from '@api';
import useAuth from '@hooks/useAuth';

const MyPage = () => {
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
    <Page name="mypage">
      <Navbar noHairline innerClassName="bg-white">
        <NavTitle>마이페이지</NavTitle>
      </Navbar>
      {isAuthenticated && (
        <a href="#" onClick={logoutHandler} className="block hover:bg-gray-50">
          <div className="flex items-center px-4 py-4 sm:px-6">
            <div className="min-w-0 flex-1 flex items-center">
              <div className="min-w-0 flex-1 md:grid md:grid-cols-2 md:gap-4">
                <div className="pl-2 flex justify-between">
                  <p className="text-sm text-font-bold text-theme-black truncate">로그아웃</p>
                  <i className="las la-angle-right" style={{ fontSize: '24px', color: 'gray' }} />
                </div>
              </div>
            </div>
          </div>
        </a>
      )}
      <Footer />
    </Page>
  );
};

export default React.memo(MyPage);
