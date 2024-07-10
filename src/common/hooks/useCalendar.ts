import { f7 } from 'framework7-react';
import { dateFormat } from '@js/utils';
import { getResevationsForThisMonth } from '@api';
import { useSetRecoilState } from 'recoil';
import { reservationState, selectedDateState, reservationByDateState } from '@atoms';

const useCalendar = (ref, containerId: string, currentDate) => {
  const setReservations = useSetRecoilState(reservationState);
  const setSelectedDate = useSetRecoilState(selectedDateState);
  const setReservationsByDate = useSetRecoilState(reservationByDateState);

  function getReservationsByDate(reservationsThisMonth) {
    const reservations = reservationsThisMonth.filter((reservation) => {
      const date = dateFormat(ref?.current.value[0], 'day');
      return dateFormat(reservation.start_at, 'day') == date;
    });
    return reservations;
  }

  function giveColor(i) {
    const colors = ['bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400'];
    return colors[i % 7];
  }

  async function addDotsAsReservations(date) {
    const dateObj = { date: dateFormat(date, 'day') };
    const reservations = await getResevationsForThisMonth(dateObj);

    const reservationCount: { [key: string]: number } = {};
    reservations.forEach((reservation) => {
      const date = new Date(reservation.start_at);
      const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!reservationCount[dateString]) {
        reservationCount[dateString] = 0;
      }
      reservationCount[dateString] += 1;
    });

    for (const [dateString, count] of Object.entries(reservationCount)) {
      const dayEls = document.querySelectorAll(`.calendar-day[data-date="${dateString}"]`);
      dayEls.forEach((dayEl) => {
        if (dayEl) {
          const dotClass = `dot-${Math.min(count, 4)}`;
          dayEl.classList.add(dotClass);
          dayEl.classList.add('relative');
          const dotsContainer = document.createElement('div');
          dotsContainer.className = 'dots absolute bottom-0 position-w-center flex justify-center h-1';
          dayEl.appendChild(dotsContainer);
          for (let i = 0; i < count && i < 4; i++) {
            const dot = document.createElement('div');
            dot.className = `dot w-5px h-5px rounded-full mx-px ${giveColor(i)}`;
            dotsContainer.appendChild(dot);
          }
        }
      });
    }
  }

  const updateReservations = async (date) => {
    const dateObj = { date: dateFormat(date, 'day') };
    const reservations = await getResevationsForThisMonth(dateObj);
    setReservations(reservations);
    const reservaitonsByDate = getReservationsByDate(reservations);
    setReservationsByDate(reservaitonsByDate);
  };

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
    const today = currentDate ? new Date(currentDate) : new Date();

    if (!ref.current) {
      ref.current = f7.calendar.create({
        containerEl: `#${containerId}`,
        value: [today],
        firstDay: 0,
        disabled: {
          from: new Date(1900, 0, 1),
          to: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
        },
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
            updateReservations(date);
            addDotsAsReservations(date);
          },
          monthYearChangeStart(c) {
            $('.calendar-custom-toolbar .center').text(`${c.currentYear}.${monthNames[c.currentMonth]}`);
            $('.calendar-day-number').forEach((el) => {
              if ($(el).text().includes('일')) {
                const day = $(el).text().replace('일', '');
                $(el).text(day);
              }
            });

            const date = dateFormat(`${c.currentYear}-${c.currentMonth + 1}-${15}`, 'day');
            highlightSundays();
            addDotsAsReservations(date);
          },
          dayClick(c, dayEl, year, month, day) {
            const date = `${year}-${month + 1}-${day}`;
            setSelectedDate(date);
            updateReservations(date);
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
