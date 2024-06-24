import { f7 } from 'framework7-react';
import { dateFormat } from '@js/utils';
import { getResevationsForThisMonth } from '@api';
import { useSetRecoilState } from 'recoil';
import { reservationState, selectedDateState } from '@atoms';

const useCalendar = (ref, containerId: string) => {
  const setReservation = useSetRecoilState(reservationState);
  const setSelectedDate = useSetRecoilState(selectedDateState);
  const onPageInit = () => {
    const $ = f7.$;
    function highlightSundays() {
      $('.calendar-month-current .calendar-day').forEach((dayEl, index) => {
        if (index % 7 === 0) {
          $(dayEl).addClass('calendar-day-sunday');
        }
      });
    }

    const monthNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    if (!ref.current) {
      ref.current = f7.calendar.create({
        containerEl: `#${containerId}`,
        value: [new Date()],
        firstDay: 0,
        renderToolbar() {
          return `
            <div class="toolbar calendar-custom-toolbar mb-3">
              <div class="toolbar-inner bg-white">
                <div class="left">
                  <a  class="link icon-only"><i class="icon icon-back"></i></a>
                </div>
                <div class="center text-lg font-semibold tracking-wide"></div>
                <div class="right">
                  <a  class="link icon-only"><i class="icon icon-forward"></i></a>
                </div>
              </div>
            </div>
          `.trim();
        },

        on: {
          init(c) {
            $('.calendar-custom-toolbar .center').text(`${c.currentYear}.${monthNames[c.currentMonth]}`);
            $('.calendar-custom-toolbar .left .link').on('click', () => {
              if (ref.current) ref.current.prevMonth();
            });
            $('.calendar-custom-toolbar .right .link').on('click', () => {
              if (ref.current) ref.current.nextMonth();
            });
            $('.calendar-day-number').forEach((el) => {
              const day = $(el).text().replace('일', '');
              $(el).text(day);
            });
            highlightSundays();
            const date = dateFormat(c.value[0], 'day');
            setSelectedDate(date);
          },
          monthYearChangeStart(c) {
            $('.calendar-custom-toolbar .center').text(`${c.currentYear}.${monthNames[c.currentMonth]}`);
            $('.calendar-day-number').forEach((el) => {
              if ($(el).text().includes('일')) {
                const day = $(el).text().replace('일', '');
                $(el).text(day);
              }
            });
            highlightSundays();
          },
          dayClick(c, dayEl, year, month, day) {
            const date = `${year}-${month + 1}-${day}`;
            setSelectedDate(date);
          },
          async opened(c) {
            const dateobj = { date: dateFormat(c.value[0], 'day') };
            const reservations = await getResevationsForThisMonth(dateobj);
            setReservation(reservations);
          },
        },
      });
    }
  };

  const onPageBeforeRemove = () => {
    if (ref.current) {
      ref.current.destroy();
      ref.current = null;
    }
  };

  return {
    onPageInit,
    onPageBeforeRemove,
  };
};

export default useCalendar;
