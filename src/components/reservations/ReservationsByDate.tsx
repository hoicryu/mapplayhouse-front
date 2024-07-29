import React from 'react';
import { dateFormat } from '@js/utils';
import i18next from 'i18next';

const ReservationsByDate = ({ reservationsByDate }) => {
  function giveColor(i) {
    const colors = [
      'bg-red-400',
      'bg-yellow-300',
      'bg-green-400',
      'bg-blue-400',
      'bg-purple-400',
      'bg-pink-400',
      'bg-indigo-300',
    ];
    return colors[i % 7];
  }

  return (
    <ul className="my-5 min-h-20 flex flex-col justify-center items-center">
      {reservationsByDate.length > 0 ? (
        reservationsByDate.map((reservation, idx) => {
          const status = reservation.status;
          return (
            <li key={`today-reservation-${reservation.id}`} className="w-full px-3 py-2 relative">
              <div className={`absolute left-0 top-0 w-2 h-full ${giveColor(idx)}`}></div>
              <div className="ml-2 flex justify-between items-center">
                <div className="flex items-center">
                  <span>{reservation.group.title}</span>
                  <span className="ml-2">{reservation.group.musical.title}</span>
                </div>
                <div className="w-5/12 flex justify-between items-center">
                  <span
                    className={`p-1 text-xs font-medium rounded-lg border-theme ${
                      status === 'before' ? 'bg-white text-theme' : 'bg-theme text-white'
                    }
                    }`}
                  >
                    {i18next.t('enum')['reservation']['status'][status]}
                  </span>
                  <span className="text-gray-500">{`${dateFormat(reservation.start_at, 'onlyTime')} ~ 
              ${dateFormat(reservation.end_at, 'onlyTime')}`}</span>
                </div>
              </div>
            </li>
          );
        })
      ) : (
        <li className="flex flex-col items-center">
          <span>공연날짜가 다가오고 있어요!</span>
          <span>연습해야죠 여러분!!!</span>
        </li>
      )}
    </ul>
  );
};
export default React.memo(ReservationsByDate);
