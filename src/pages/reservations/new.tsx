import React, { useEffect, useRef, useState } from 'react';
import { Button, Navbar, Page } from 'framework7-react';
import { Objects, PageRouteProps, TimeList } from '@constants';
import { useQuery } from 'react-query';
import { getObjects } from '@api';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { reservationState, selectedDateState, timeListState } from '@atoms';
import useCalendar from '@hooks/useCalendar';
import { dateFormat } from '@js/utils';
import Form from '@components/reservations/Form';
import { getResevationsForThatDay } from '@api';
import calImg from '@assets/icons/calendar.png';

const ReservationNewPage = ({ f7router }: PageRouteProps) => {
  const calendarRef = useRef(null);
  const { onPageInit, onPageBeforeRemove } = useCalendar(calendarRef, 'reservation-index-calendar-container');
  const timeList = useRecoilValue(timeListState);
  const setTimeList = useSetRecoilState(timeListState);
  const reservationsThisMonth = useRecoilValue(reservationState);
  const [availableTimeList, setAvailableTimeList] = useState<TimeList[]>([]);
  const [todayReservations, setTodayReservations] = useState([]);
  const selectedStringDate = useRecoilValue(selectedDateState);
  const selectedDate = dateFormat(new Date(selectedStringDate), 'calendar');
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');
  const [numOfClick, setNumOfClick] = useState<number>(0);
  const [isTimeListReady, setIsTimeListReady] = useState(false);
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

  function calculateTime(startTime, endTime) {
    const isOddClick = numOfClick % 2 === 0;
    const isEvenClick = numOfClick % 2;
    if (isEvenClick && startTime === selectedStartTime) {
      setSelectedStartTime('');
      setSelectedEndTime('');
      return setNumOfClick(numOfClick + 1);
    }
    if (isOddClick) {
      setSelectedStartTime(startTime);
      setSelectedEndTime(endTime);
    }
    if (isEvenClick) {
      if (startTime && endTime) {
        if (startTime < selectedStartTime) setSelectedStartTime(startTime);
        if (endTime > selectedEndTime) setSelectedEndTime(endTime);
        return setNumOfClick(numOfClick + 1);
      }
      setSelectedEndTime(endTime);
    }
    setNumOfClick(numOfClick + 1);
  }

  function getTodayReservations() {
    const reservations = reservationsThisMonth.filter((reservation) => {
      const today = dateFormat(calendarRef?.current.value[0], 'day');
      return dateFormat(reservation.start_at, 'day') == today;
    });
    setTodayReservations(reservations);
  }

  function isIncludedTime(startTime: string, endTime: string) {
    return selectedEndTime >= endTime && selectedStartTime <= startTime;
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
  async function checkAvailableReservationTimes() {
    const dateobj = { date: dateFormat(calendarRef.current.value[0], 'day') };
    const reservations = await getResevationsForThatDay(dateobj);
    const unavailableTimes = reservations.map((reservation) => {
      return {
        start_at: dateFormat(new Date(reservation.start_at), 'onlyTime'),
        end_at: dateFormat(new Date(reservation.end_at), 'onlyTime'),
      };
    });

    if (unavailableTimes.length > 0) {
      const updatedList = availableTimeList.map((timeList) => {
        const isOverlapping = unavailableTimes.some((unavailableTime) => {
          return (
            (timeList.start_time >= unavailableTime.start_at && timeList.start_time < unavailableTime.end_at) ||
            (timeList.end_time > unavailableTime.start_at && timeList.end_time <= unavailableTime.end_at) ||
            (timeList.start_time <= unavailableTime.start_at && timeList.end_time >= unavailableTime.end_at)
          );
        });
        if (isOverlapping) {
          return { ...timeList, disabled: true };
        } else {
          return timeList;
        }
      });

      setAvailableTimeList(updatedList);
    } else {
      setAvailableTimeList(timeList);
    }
  }

  useEffect(() => {
    getTodayReservations();
  }, [selectedStringDate]);

  useEffect(() => {
    setAvailableTimeList(timeList);
    setIsTimeListReady(true);
  }, [timeList]);

  useEffect(() => {
    if (isTimeListReady) checkAvailableReservationTimes();
  }, [selectedDate, isTimeListReady]);

  // reservationsthisMonth 는 달력 표시용

  return (
    <Page onPageInit={onPageInit} onPageBeforeRemove={onPageBeforeRemove}>
      <Navbar noHairline innerClassName="bg-white" title="연습실 예약" />
      <div id="reservation-index-calendar-container"></div>
      <div className="w-full bg-gray-100 my-2" style={{ height: '2px' }}></div>
      <ul className="my-5 min-h-20 flex justify-center items-center">
        {todayReservations.length > 0 ? (
          todayReservations.map((reservation, idx) => (
            <li className="w-full px-3 py-2 relative">
              <div className={`absolute left-0 top-0 w-2 h-full ${giveColor(idx)}`}></div>
              <div className="ml-2 flex justify-between items-center">
                <span>{reservation.note}</span>
                <span className="text-gray-500">{`${dateFormat(reservation.start_at, 'onlyTime')} ~ 
              ${dateFormat(reservation.end_at, 'onlyTime')}`}</span>
              </div>
            </li>
          ))
        ) : (
          <li className="flex flex-col items-center">
            <span>공연날짜가 다가오고 있어요!</span>
            <span>연습해야죠 여러분!!!</span>
          </li>
        )}
      </ul>
      <div className="w-full bg-gray-100 my-2" style={{ height: '2px' }}></div>
      <div className="ml-4 mt-5 flex items-center">
        <img src={calImg} width="20" />
        <span className="ml-1.5 text-sm">
          {selectedDate && (selectedStartTime || selectedEndTime)
            ? `${selectedDate} ${selectedStartTime} ${selectedEndTime && '~' + selectedEndTime}`
            : '날짜와 시간을 선택해 주세요.'}
        </span>
      </div>
      <div className="py-4 px-4 flex justify-center flex-wrap gap-2">
        {availableTimeList.map((time, idx) => (
          <Button
            key={`time-${idx}`}
            onClick={() => calculateTime(time.start_time, time.end_time)}
            className={`p-4 border border-slate-100 text-sm rounded-lg font-medium 
              ${isIncludedTime(time.start_time, time.end_time) && 'text-white bg-theme'}`}
            disabled={time?.disabled}
          >
            {time.start_time}
          </Button>
        ))}
      </div>
      <div>
        {selectedStartTime.length > 0 && (
          <>
            <div className="w-full bg-gray-100 my-2" style={{ height: '2px' }}></div>
            <Form f7router={f7router} startTime={selectedStartTime} endTime={selectedEndTime} />
          </>
        )}
      </div>
    </Page>
  );
};
export default React.memo(ReservationNewPage);
