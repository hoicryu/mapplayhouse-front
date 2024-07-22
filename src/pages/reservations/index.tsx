import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Button, List, ListItem, Navbar, Page } from 'framework7-react';
import { getReservations } from '@api';
import { Reservation } from '@constants';
import BackLinkNav from '@components/shared/BackLinkNav';
import i18next from 'i18next';
import { dateFormat } from '@js/utils';

const ReservationIndexPage = ({ f7router }) => {
  const { data: reservations, error } = useQuery<Reservation[]>('reservations', getReservations(), {
    onSuccess: (data) => {
      // console.log(data);
    },
  });

  return (
    <Page>
      <BackLinkNav title="내 예약" />
      <div>filter zone</div>
      <div className="w-full bg-gray-100 my-2" style={{ height: '2px' }}></div>
      <div className="mt-3">
        {reservations ? (
          reservations?.map((reservation) => (
            <div
              className="flex px-7 py-5 mx-4 my-5 border rounded-xl justify-between items-center shadow-md"
              key={`reservation-box-${reservation.id}`}
            >
              <div className="flex flex-col items-start">
                <span className="text-base font-semibold">{`${reservation.group.title} ${reservation.group.musical.title}`}</span>
                <div className="mt-1 text-xs text-gray-500">
                  <span>{dateFormat(reservation.start_at, 'day')}</span>
                  <span className="ml-1.5">{`${dateFormat(reservation.start_at, 'onlyTime')} ~ 
              ${dateFormat(reservation.end_at, 'onlyTime')}`}</span>
                </div>

                <span className="mt-1 text-xs">연습내용 : {reservation.note}</span>
                {reservation.status === 'rejected' && <span>거부사유 토글</span>}
              </div>
              <span className="py-0.3 px-1.5 flex-shrink-0 text-xxs font-medium rounded-xl border-theme">
                {i18next.t('enum')['reservation']['status'][reservation.status]}
              </span>
            </div>
          ))
        ) : (
          <div>아직 예약내역이 없어요!</div>
        )}
      </div>
    </Page>
  );
};
export default React.memo(ReservationIndexPage);
