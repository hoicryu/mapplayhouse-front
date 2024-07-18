import React from 'react';
import { Navbar, Page, NavTitle } from 'framework7-react';
import Footer from '@components/shared/Footer';
import { IMAGE_API_URL, logoutAPI } from '@api';
import useAuth from '@hooks/useAuth';
import { FaUserCircle } from 'react-icons/fa';
import settingImg from '@assets/icons/settings2.png';

const MyPage = () => {
  const { currentUser, isAuthenticated } = useAuth();

  const myPageButtons = [
    { title: '내 예약', path: '/reservations/user_reservations' },
    { title: '참여 작품', path: '/groups/user_groups' },
    { title: '공지사항', path: '/notices' },
    { title: '자주 묻는 질문', path: '/qna' },
  ];

  return (
    <Page name="mypage">
      <Navbar noHairline innerClassName="bg-white">
        <NavTitle>마이페이지</NavTitle>
      </Navbar>
      <div className="mt-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
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
          <h1 className="ml-5 text-base font-bold text-gray-900">{currentUser?.name}</h1>
        </div>
        <a href="/settings" className="px-3 py-2 border rounded-2xl">
          <img src={settingImg} alt="" className="h-4 w-4" />
        </a>
      </div>
      <div className="w-full bg-gray-100 my-7" style={{ height: '2px' }}></div>
      {isAuthenticated && (
        <ul className="divide-y divide-gray-200">
          {myPageButtons.map((button,idx) => (
            <li key={`mypage-btn-${idx}`}>
              <a href={button.path} className="block hover:bg-gray-50">
                <div className="px-5 py-3 flex justify-between items-center">
                  <p className="text-sm font-semibold text-theme-black truncate">{button.title}</p>
                  <i className="las la-angle-right" style={{ fontSize: '20px', color: 'gray' }} />
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
      <Footer />
    </Page>
  );
};

export default React.memo(MyPage);
