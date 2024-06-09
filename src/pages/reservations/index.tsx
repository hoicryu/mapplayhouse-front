import React, { useEffect } from 'react';
import { Link, Navbar, Page } from 'framework7-react';
import Calendar from '@components/reservations/Calendar';
import { Objects, PageRouteProps, Reservation, TimeList } from '@constants';
import { useQuery } from 'react-query';
import { getObjects } from '@api';
import { useSetRecoilState } from 'recoil';
import { timeListState } from '@atoms';

const ReservationIndexPage = ({ f7route }: PageRouteProps) => {
  const setTimeList = useSetRecoilState(timeListState);
  const { data: timeLists, error } = useQuery<Objects<TimeList>, Error>(
    'timeList',
    getObjects({ model_name: 'time_list' }),
  );

  useEffect(() => {
    timeLists?.objects.forEach((time) => delete time.model_name);
    setTimeList(timeLists?.objects);
  }, [timeLists]);

  return (
    <Page>
      <Navbar noHairline innerClassName="bg-white" title="예약" />
      {/* <Calendar /> */}
      <Link href="/reservations/new">예약하러가기</Link>
    </Page>
  );
};
export default React.memo(ReservationIndexPage);
