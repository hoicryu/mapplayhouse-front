import React, { useCallback } from 'react';
import { Navbar, Page, NavTitle } from 'framework7-react';
import Footer from '@components/shared/Footer';
import { IMAGE_API_URL, logoutAPI } from '@api';
import useAuth from '@hooks/useAuth';
import { FaUserCircle } from 'react-icons/fa';

const MyPage = () => {
  const { currentUser, isAuthenticated, unAuthenticateUser } = useAuth();
  const logoutHandler = useCallback(async () => {
    try {
      await logoutAPI();
    } finally {
      unAuthenticateUser();
    }
    window.location.reload();
  }, [unAuthenticateUser]);

  const myPageButtons = [
    // ['/users/edit', mypageOrder, '프로필수정'],
    // ['/reservations/user_reservations', mypageCoupon, '내 예약'],
    // ['/groups/user_groups', mypagePoint, '참여 작품들'],
    // ['/notices', mypageMarketLike, '공지사항'],
    // ['/qna', mypageReview, '자주 묻는 질문'],
    // ['/terms', mypageContact, '개인정보처리방침'],
  ];

  return (
    <Page name="mypage">
      <Navbar noHairline innerClassName="bg-white">
        <NavTitle>마이페이지</NavTitle>
      </Navbar>
      <div className="px-6 flex items-center">
        <div className="flex-shrink-0">
          <a href={`/users/${currentUser?.id}`}>
            <div className="relative">
              {currentUser?.image_path ? (
                <img className="h-16 w-16 rounded-full" src={IMAGE_API_URL + currentUser?.image_path} alt="" />
              ) : (
                <FaUserCircle style={{ fontSize: '80px', color: 'gray' }} />
              )}
              <span className="absolute inset-0 shadow-inner rounded-full" aria-hidden="true" />
            </div>
          </a>
        </div>
        <h1 className="ml-5 text-lg font-bold text-gray-900">{currentUser?.name}</h1>
      </div>

      {isAuthenticated && (
        <ul className="divide-y divide-gray-200">
          <li>
            <a href="/users/edit" className="block hover:bg-gray-50">
              <div className="flex items-center px-4 py-4 sm:px-6">
                <div className="min-w-0 flex-1 flex items-center">
                  <div className="min-w-0 flex-1 md:grid md:grid-cols-2 md:gap-4">
                    <div className="pl-2 flex justify-between">
                      <p className="text-sm text-font-bold text-theme-black truncate">회원정보수정</p>
                      <i className="las la-angle-right" style={{ fontSize: '24px', color: 'gray' }} />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </li>
          <li>
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
          </li>
          <li>
            <a href="/contacts" className="block hover:bg-gray-50">
              <div className="flex items-center px-4 py-4 sm:px-6">
                <div className="min-w-0 flex-1 flex items-center">
                  <div className="min-w-0 flex-1 md:grid md:grid-cols-2 md:gap-4">
                    <div className="pl-2 flex justify-between">
                      <p className="text-sm text-font-bold text-theme-black truncate">문의</p>
                      <i className="las la-angle-right" style={{ fontSize: '24px', color: 'gray' }} />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </li>
        </ul>
      )}

      <Footer />
    </Page>
  );
};

export default React.memo(MyPage);
