import React from 'react';
import { Link, Navbar, Page } from 'framework7-react';

const ContactIndexPage = ({ f7route }) => {
  const { is_main } = f7route.query;

  return (
    <Page noToolbar={!is_main} ptr>
      <Navbar noHairline backLink innerClassName="bg-white" title="문의" />
      <span>문의내역</span>
    </Page>
  );
};
export default React.memo(ContactIndexPage);
