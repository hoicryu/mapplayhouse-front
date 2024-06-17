import React, { useEffect, useRef, useState } from 'react';
import { Page, Button } from 'framework7-react';
import { PageRouteProps } from '@constants';
import { useRecoilValue } from 'recoil';
import { timeListState, selectedDateState } from '@atoms';
import useCalendar from '@hooks/useCalendar';
import BackLinkNav from '@components/shared/BackLinkNav';
import Form from '@components/reservations/Form';
import calImg from '@assets/icons/calendar.png';

const ReservationNewPage = ({ f7route, f7router }: PageRouteProps) => {
  const calendarRef = useRef(null);
  const { onPageInit, onPageBeforeRemove } = useCalendar(calendarRef, 'reservation-new-calendar-container');
  const timeList = useRecoilValue(timeListState);
  const [selectedTime, setSelectedTime] = useState<string[]>([]);
  const selectedDate = useRecoilValue(selectedDateState);
  const [timeText, setTimeText] = useState<string>('');

  function setReservationTime(e) {
    const startTime = e.target.text;
    if (selectedTime.includes(startTime)) {
      setSelectedTime([...selectedTime.filter((time) => time != startTime)]);
    } else {
      setSelectedTime([...selectedTime, startTime]);
    }
  }

  // timeText
  // selectedTime이 변경될때마다 useEffect
  // timeList 에서 selectedTime객체를 찾고 start_at ~ end_at으로 표기
  // selectedTime이 항상 정렬되어있어야 한다.
  // 이전 start_at과 다음 start_at이 30분이상 차이난다면 분리해서 보여주어야하고
  // 30분이상 차이 나는것이 없다면 첫번째 것의 start_at 마지막것의 end_at을 보여준다.

  // function calculdateReservationTime() {
  //   console.log(selectedTime);
  // }

  return (
    <Page onPageInit={onPageInit} onPageBeforeRemove={onPageBeforeRemove} className="">
      <BackLinkNav title="연습 예약" />
      <div id="reservation-new-calendar-container"></div>
      <div className="ml-4 mt-5 flex items-center">
        <img src={calImg} width="24" />
        <span className="ml-2 text-base">
          {selectedDate && selectedTime.length ? `${selectedDate} ${selectedTime}` : '날짜와 시간을 선택해 주세요.'}
        </span>
      </div>
      <div className="mt-5 px-4 flex justify-center flex-wrap gap-2">
        {timeList.map((time, idx) => (
          <Button
            key={`time-${idx}`}
            onClick={setReservationTime}
            className={`p-4 border border-slate-100 text-sm rounded-lg font-medium ${
              selectedTime.includes(time.start_time) ? 'text-white bg-theme' : ''
            }`}
          >
            {time.start_time}
          </Button>
        ))}
      </div>
      <div>{selectedTime.length > 0 && <Form f7router={f7router} selectedTime={selectedTime} />}</div>
    </Page>
  );
};
export default React.memo(ReservationNewPage);
