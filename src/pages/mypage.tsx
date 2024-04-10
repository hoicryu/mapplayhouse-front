import React from 'react';
import { Navbar, Page, NavTitle } from 'framework7-react';
import Footer from '@components/shared/Footer';

const MyPage = () => {
  return (
    <Page name="mypage">
      <Navbar noHairline innerClassName="bg-white">
        <NavTitle>마이페이지</NavTitle>
      </Navbar>
      <Footer />
    </Page>
  );
};

export default React.memo(MyPage);
