import React, { useEffect, useRef, useState } from 'react';
import { Page, Button } from 'framework7-react';
import { PageRouteProps, TimeList } from '@constants';
import { useRecoilValue } from 'recoil';
import { timeListState, selectedDateState } from '@atoms';
import useCalendar from '@hooks/useCalendar';
import BackLinkNav from '@components/shared/BackLinkNav';
import Form from '@components/reservations/Form';
import calImg from '@assets/icons/calendar.png';
import { dateFormat } from '@js/utils';
import { getResevationsForThatDay } from '@api';

const ReservationNewPage = ({ f7route, f7router }: PageRouteProps) => {
  const calendarRef = useRef(null);
  const { onPageInit, onPageBeforeRemove } = useCalendar(calendarRef, 'reservation-new-calendar-container');
  const timeList = useRecoilValue(timeListState);
  const [availableTimeList, setAvailableTimeList] = useState<TimeList[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');
  const [numOfClick, setNumOfClick] = useState<number>(0);
  const selectedStringDate = useRecoilValue(selectedDateState);
  const selectedDate = dateFormat(new Date(selectedStringDate), 'calendar');
  const [isTimeListReady, setIsTimeListReady] = useState(false);

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

  function isIncludedTime(startTime: string, endTime: string) {
    return selectedEndTime >= endTime && selectedStartTime <= startTime;
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
    setAvailableTimeList(timeList);
    setIsTimeListReady(true);
  }, [timeList]);

  useEffect(() => {
    if (isTimeListReady) checkAvailableReservationTimes();
  }, [selectedDate, isTimeListReady]);

  return (
    <Page onPageInit={onPageInit} onPageBeforeRemove={onPageBeforeRemove} className="">
      <BackLinkNav title="연습 예약" />
      <div id="reservation-new-calendar-container"></div>
      <div className="ml-4 mt-5 flex items-center">
        <img src={calImg} width="24" />
        <span className="ml-2 text-base">
          {selectedDate && (selectedStartTime || selectedEndTime)
            ? `${selectedDate} ${selectedStartTime} ${selectedEndTime && '~' + selectedEndTime}`
            : '날짜와 시간을 선택해 주세요.'}
        </span>
      </div>
      <div className="mt-5 px-4 flex justify-center flex-wrap gap-2">
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
          <Form f7router={f7router} startTime={selectedStartTime} endTime={selectedEndTime} />
        )}
      </div>
    </Page>
  );
};
export default React.memo(ReservationNewPage);
