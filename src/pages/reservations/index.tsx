import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Button, Navbar, Page } from 'framework7-react';
import { getReservations } from '@api';
import { Reservation } from '@constants';

const ReservationIndexPage = ({ f7router }) => {
  const { data: reservations, error } = useQuery<Reservation[]>('reservations', getReservations(), {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <Page>
      <Navbar noHairline innerClassName="bg-white" title="내 예약" />
      <div>dasdsadsadsa</div>
    </Page>
  );
};
export default React.memo(ReservationIndexPage);
