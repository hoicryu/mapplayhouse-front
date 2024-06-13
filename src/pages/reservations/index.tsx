import React, { useEffect, useRef } from 'react';
import { Link, Navbar, Page } from 'framework7-react';
import { Objects, PageRouteProps, TimeList } from '@constants';
import { useQuery } from 'react-query';
import { getObjects } from '@api';
import { useSetRecoilState } from 'recoil';
import { timeListState } from '@atoms';
import useCalendar from '@hooks/useCalendar';

const ReservationIndexPage = ({ f7route }: PageRouteProps) => {
  const calendarInline = useRef(null);
  const { onPageInit, onPageBeforeRemove } = useCalendar(calendarInline, 'reservation-index-calendar-container');
  const setTimeList = useSetRecoilState(timeListState);
  const { data: timeLists, error } = useQuery<Objects<TimeList>, Error>(
    'timeList',
    getObjects({ model_name: 'time_list' }),
    {
      onSuccess: (data) => {
        data.objects.forEach((time) => delete time.model_name);
        setTimeList(data.objects);
      },
    },
  );

  return (
    <Page onPageInit={onPageInit} onPageBeforeRemove={onPageBeforeRemove}>
      <Navbar noHairline innerClassName="bg-white" title="예약" />
      <div id="reservation-index-calendar-container"></div>
      <Link href="/reservations/new" className="mt-15">
        예약하러가기
      </Link>
    </Page>
  );
};
export default React.memo(ReservationIndexPage);
