import React, { useEffect } from 'react';
import { Navbar, Page } from 'framework7-react';
import Calendar from '@components/reservations/Calendar';
import { PageRouteProps } from '@constants';
import { useRecoilValue } from 'recoil';
import { timeListState } from '@atoms';

const ReservationNewPage = ({ f7route }: PageRouteProps) => {
  const timeList = useRecoilValue(timeListState);
  console.log(timeList);

  return (
    <Page>
      <Navbar noHairline innerClassName="bg-white" title="예약" />
    </Page>
  );
};
export default React.memo(ReservationNewPage);
