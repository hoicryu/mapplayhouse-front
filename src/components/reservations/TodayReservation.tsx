import React from 'react';
import { dateFormat } from '@js/utils';

const TodayReservations = ({ todayReservations }) => {
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

  return (
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
  );
};
export default React.memo(TodayReservations);
