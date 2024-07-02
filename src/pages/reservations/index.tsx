import React, { useEffect, useRef, useState } from 'react';
import { Button, Link, Navbar, Page } from 'framework7-react';
import { Objects, PageRouteProps, TimeList } from '@constants';
import { useQuery } from 'react-query';
import { getObjects } from '@api';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { reservationState, selectedDateState, timeListState } from '@atoms';
import useCalendar from '@hooks/useCalendar';
import { dateExpired, dateFormat } from '@js/utils';

const ReservationIndexPage = ({ f7route }: PageRouteProps) => {
  const calendarInline = useRef(null);
  const { onPageInit, onPageBeforeRemove } = useCalendar(calendarInline, 'reservation-index-calendar-container');
  const setTimeList = useSetRecoilState(timeListState);
  const reservationsThisMonth = useRecoilValue(reservationState);
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
      'bg-yellow-300',
      'bg-green-400',
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
      <div id="reservation-index-calendar-container"></div>
      <div className="w-full bg-gray-100 my-2" style={{ height: '2px' }}></div>
      <ul className="mt-5">
        {todayReservations?.map((reservation, idx) => (
          <li className="w-full px-3 py-2 relative">
            <div className={`absolute left-0 top-0 w-2 h-full ${giveColor(idx)}`}></div>
            <div className="ml-2 flex justify-between items-center">
              <span>{reservation.note}</span>
              <span className="text-gray-500">{`${dateFormat(reservation.start_at, 'onlyTime')} ~ 
              ${dateFormat(reservation.end_at, 'onlyTime')}`}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-5">
        <Button fill href="/reservations/new" className="w-1/2 py-5">
          예약하러가기
        </Button>
      </div>
    </Page>
  );
};
export default React.memo(ReservationIndexPage);
