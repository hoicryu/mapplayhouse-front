import { f7 } from 'framework7-react';
import { dateFormat } from '@js/utils';
import { getResevationsForThisMonth } from '@api';
import { useSetRecoilState } from 'recoil';
import { reservationState } from '@atoms';

const useCalendar = (ref) => {
  const setReservation = useSetRecoilState(reservationState);
  const onPageInit = () => {
    const $ = f7.$;

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    ref.current = f7.calendar.create({
      containerEl: '#calendar-inline-container',
      value: [new Date()],
      renderToolbar() {
        return `
          <div class="toolbar calendar-custom-toolbar">
            <div class="toolbar-inner">
              <div class="left">
                <a  class="link icon-only"><i class="icon icon-back"></i></a>
              </div>
              <div class="center"></div>
              <div class="right">
                <a  class="link icon-only"><i class="icon icon-forward"></i></a>
              </div>
            </div>
          </div>
        `.trim();
      },
      on: {
        init(c) {
          $('.calendar-custom-toolbar .center').text(`${monthNames[c.currentMonth]}, ${c.currentYear}`);
          $('.calendar-custom-toolbar .left .link').on('click', () => {
            ref.current.prevMonth();
          });
          $('.calendar-custom-toolbar .right .link').on('click', () => {
            ref.current.nextMonth();
          });
        },
        monthYearChangeStart(c) {
          $('.calendar-custom-toolbar .center').text(`${monthNames[c.currentMonth]}, ${c.currentYear}`);
        },
        dayClick(calendar, dayEl, year, month, day) {
          const dateobj = { date: `${year}-${month + 1}-${day}` };
        },
        async opened(c) {
          const dateobj = { date: dateFormat(c.value[0], 'day') };
          const reservations = await getResevationsForThisMonth(dateobj);
          setReservation(reservations);
        },
      },
    });
  };

  const onPageBeforeRemove = () => {
    ref.current.destroy();
  };

  return {
    onPageInit,
    onPageBeforeRemove,
  };
};

export default useCalendar;
