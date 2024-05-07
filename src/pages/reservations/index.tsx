import React from 'react';
import { Navbar, Page } from 'framework7-react';

const ReservationIndexPage = ({ f7route }) => {
  const { is_main } = f7route.query;

  return (
    <Page noToolbar={!is_main} ptr>
      <Navbar noHairline innerClassName="bg-white" title="예약" />
      예약하기
    </Page>
  );
};
export default React.memo(ReservationIndexPage);
