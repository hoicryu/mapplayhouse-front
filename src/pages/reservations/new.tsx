import React, { useEffect, useRef, useState } from 'react';
import { Page, Button } from 'framework7-react';
import { PageRouteProps } from '@constants';
import { useRecoilValue } from 'recoil';
import { timeListState } from '@atoms';
import useCalendar from '@hooks/useCalendar';
import BackLinkNav from '@components/shared/BackLinkNav';

const ReservationNewPage = ({ f7route }: PageRouteProps) => {
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
      <div id="reservation-new-calendar-container"></div>
      <div className="pt-4 px-4 flex flex-wrap gap-4">
        {timeList.map((time) => (
          <Button
            onClick={setReservationTime}
            className={`p-4 border border-slate-100 text-base rounded-lg ${
              selectedTime.includes(time.start_time) ? 'text-white bg-theme' : ''
            }`}
          >
            {time.start_time}
          </Button>
        ))}
      </div>
    </Page>
  );
};
export default React.memo(ReservationNewPage);
