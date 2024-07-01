import React, { useEffect, useRef, useState } from 'react';
import { Link, Navbar, Page } from 'framework7-react';
import { Objects, PageRouteProps, TimeList } from '@constants';
import { useQuery } from 'react-query';
import { getObjects } from '@api';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { reservationState, selectedDateState, timeListState } from '@atoms';
import useCalendar from '@hooks/useCalendar';
import { dateFormat } from '@js/utils';

const ReservationIndexPage = ({ f7route }: PageRouteProps) => {
  const calendarInline = useRef(null);
  const { onPageInit, onPageBeforeRemove } = useCalendar(calendarInline, 'reservation-index-calendar-container');
  const setTimeList = useSetRecoilState(timeListState);
  const reservationsThisMonth = useRecoilValue(reservationState);
  const [dateText, setDateText] = useState<string>('날짜와 시간을 선택해주세요.');
  const [todayReservations, setTodayReservations] = useState([]);
  const selectedStringDate = useRecoilValue(selectedDateState);
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

  function getTodayReservations() {
    const reservations = reservationsThisMonth.filter((reservation) => {
      const today = dateFormat(calendarInline?.current.value[0], 'day');
      return dateFormat(reservation.start_at, 'day') == today;
    });
    setTodayReservations(reservations);
  }

  function giveColor(i) {
    const colors = [
      'bg-red-400',
      'bg-amber-400',
      'bg-lime-400',
      'bg-teal-400',
      'bg-sky-400',
      'bg-indigo-400',
      'bg-purple-400',
    ];
    return colors[i % 7];
  }

  useEffect(() => {
    getTodayReservations();
  }, [selectedStringDate]);

  // reservationsthisMonth 는 달력 표시용

  return (
    <Page onPageInit={onPageInit} onPageBeforeRemove={onPageBeforeRemove}>
      <Navbar noHairline innerClassName="bg-white" title="예약" />
      <span>{dateText}</span>
      <div id="reservation-index-calendar-container"></div>
      <div className="mt-2">
        {todayReservations?.map((reservation, idx) => (
          <div className="w-full pr-2 py-3">
            <div className="flex items-center">
              <div className={`w-2 ${giveColor(idx)}`}></div>
              <span>{reservation.note}</span>
            </div>
          </div>
        ))}
      </div>
      <div></div>
      <Link href="/reservations/new" className="mt-15">
        예약하러가기
      </Link>
    </Page>
  );
};
export default React.memo(ReservationIndexPage);
