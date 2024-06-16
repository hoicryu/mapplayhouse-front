import React, { useRef, useState } from 'react';
import { Page, Button } from 'framework7-react';
import { PageRouteProps } from '@constants';
import { useRecoilValue } from 'recoil';
import { timeListState } from '@atoms';
import useCalendar from '@hooks/useCalendar';
import BackLinkNav from '@components/shared/BackLinkNav';
import Form from '@components/reservations/Form';

const ReservationNewPage = ({ f7route, f7router }: PageRouteProps) => {
  const calendarRef = useRef(null);
  const { onPageInit, onPageBeforeRemove } = useCalendar(calendarRef, 'reservation-new-calendar-container');
  const timeList = useRecoilValue(timeListState);
  const [selectedTime, setSelectedTime] = useState<string[]>([]);

  function setReservationTime(e) {
    const startTime = e.target.text;
    if (selectedTime.includes(startTime)) {
      setSelectedTime(selectedTime.filter((time) => time != startTime));
    } else {
      setSelectedTime([...selectedTime, startTime]);
    }
  }

  return (
    <Page onPageInit={onPageInit} onPageBeforeRemove={onPageBeforeRemove}>
      <BackLinkNav title="연습 예약" />
      <span>날짜와 시간을 선택해주세요.</span>
      <div id="reservation-new-calendar-container"></div>
      <div className="pt-4 px-4 flex justify-center flex-wrap gap-2">
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
