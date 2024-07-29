import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Button, Navbar, Page } from 'framework7-react';
import { Objects, TimeList } from '@constants';
import { useRecoilState, useRecoilValue } from 'recoil';
import { customToastState, reservationByDateState, selectedDateState } from '@atoms';
import { getObjects, getResevationsForThatDay } from '@api';
import useCalendar from '@hooks/useCalendar';
import { dateFormat } from '@js/utils';
import Form from '@components/reservations/Form';
import ReservationsByDate from '@components/reservations/ReservationsByDate';
import calImg from '@assets/icons/calendar.png';

const ReservationNewPage = ({ f7router, date }) => {
  const calendarRef = useRef(null);
  const { onPageInit, onPageBeforeRemove } = useCalendar(calendarRef, 'reservation-calendar-container', date);

  const reservationsByDate = useRecoilValue(reservationByDateState);
  const selectedStringDate = useRecoilValue(selectedDateState);
  const selectedDate = dateFormat(new Date(selectedStringDate), 'calendar');
  const [openCustomToast, setOpenCustomToast] = useRecoilState(customToastState);

  const [availableTimeList, setAvailableTimeList] = useState<TimeList[]>([]);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
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
        setIsTimeListReady(true);
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
        const startTimeToBeSet = startTime < selectedStartTime ? startTime : selectedStartTime;
        const endTimeToBeSet = endTime > selectedEndTime ? endTime : selectedEndTime;
        const isOverlapping = unavailableTimes.some((unavailableTime) => {
          const unavailableStart = unavailableTime.start_at;
          const unavailableEnd = unavailableTime.end_at;
          return (
            (startTimeToBeSet < unavailableEnd && endTimeToBeSet > unavailableStart) ||
            (startTimeToBeSet >= unavailableStart && startTimeToBeSet < unavailableEnd) ||
            (endTimeToBeSet > unavailableStart && endTimeToBeSet <= unavailableEnd)
          );
        });

        if (isOverlapping) {
          return setOpenCustomToast({
            ...openCustomToast,
            content: `예약이 불가한 시간입니다.`,
            open: true,
          });
        }

        setSelectedStartTime(startTimeToBeSet);
        setSelectedEndTime(endTimeToBeSet);
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
    setUnavailableTimes(unavailableTimes);

    if (unavailableTimes.length > 0) {
      const updatedList = timeLists?.objects.map((timeList) => {
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
      setAvailableTimeList(timeLists.objects);
    }
  }

  useEffect(() => {
    if (isTimeListReady) checkAvailableReservationTimes();
  }, [selectedDate, isTimeListReady]);

  return (
    <Page onPageInit={onPageInit} onPageBeforeRemove={onPageBeforeRemove}>
      <Navbar noHairline innerClassName="bg-white" title="연습실 예약" />
      <div id="reservation-calendar-container"></div>
      <div className="w-full bg-gray-100 my-2" style={{ height: '2px' }}></div>
      <ReservationsByDate reservationsByDate={reservationsByDate} />
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
            className={`p-4 border border-gray-500 text-sm rounded-lg font-medium
              ${isIncludedTime(time.start_time, time.end_time) && 'text-white bg-gray-500'}`}
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
