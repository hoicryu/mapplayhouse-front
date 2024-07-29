import React from 'react';
import { Navbar, Page, NavTitle } from 'framework7-react';
import ProfileCard from '@components/mypage/ProfileCard';
import Footer from '@components/shared/Footer';
import useAuth from '@hooks/useAuth';

const MyPage = () => {
  const { isAuthenticated } = useAuth();
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
      <ProfileCard />
      <div className="w-full bg-gray-100 my-7" style={{ height: '2px' }}></div>
      {isAuthenticated && (
        <ul className="divide-y divide-gray-200">
          {myPageButtons.map((button, idx) => (
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
