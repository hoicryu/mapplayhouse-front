import React from 'react';
import { Navbar, NavTitle, Page } from 'framework7-react';

const GroupIndexPage = ({ f7route }) => {
  const { is_main } = f7route.query;

  return (
    <Page noToolbar={!is_main} ptr>
      <Navbar noHairline innerClassName="bg-white" title="참여 신청" />
      <NavTitle>신청하기</NavTitle>
    </Page>
  );
};
export default React.memo(GroupIndexPage);
