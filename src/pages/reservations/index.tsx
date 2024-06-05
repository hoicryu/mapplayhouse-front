import React from 'react';
import { Link, Navbar, Page } from 'framework7-react';
import Calendar from '@components/reservations/Calendar';

const ReservationIndexPage = ({ f7route }) => {
  return (
    <Page>
      <Navbar noHairline innerClassName="bg-white" title="예약" />
      <Calendar />
    </Page>
  );
};
export default React.memo(ReservationIndexPage);
