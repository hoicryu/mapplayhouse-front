import React from 'react';
import { Link, Navbar, Page } from 'framework7-react';

const ReservationIndexPage = ({ f7route }) => {
  const { is_main } = f7route.query;

  return (
    <Page noToolbar={!is_main} ptr>
      <Navbar noHairline innerClassName="bg-white" title="예약" />
      <Link href={`/application_forms/new?group_id=${2}`} className="w-100 mt-3 flex">
        예약하기
      </Link>
    </Page>
  );
};
export default React.memo(ReservationIndexPage);
