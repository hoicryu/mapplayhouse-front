import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Button, Navbar, Page } from 'framework7-react';
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
      {reservations ? (
        reservations?.map((reservation) => (
          <div key={`reservation-box-${reservation.id}`}>
            <div>{i18next.t('enum')['reservation']['status'][reservation.status]} status 뱃지</div>
            <span>{`${reservation.group.title} ${reservation.group.musical.title}`}</span>
            <span>{`${dateFormat(reservation.start_at, 'day')} ${dateFormat(reservation.start_at, 'onlyTime')} ~ 
              ${dateFormat(reservation.end_at, 'onlyTime')}`}</span>
            <span>{reservation.note}</span>
            {reservation.status === 'rejected' && <span>거부사유 토글</span>}
          </div>
        ))
      ) : (
        <div>아직 예약내역이 없어요!</div>
      )}
    </Page>
  );
};
export default React.memo(ReservationIndexPage);
