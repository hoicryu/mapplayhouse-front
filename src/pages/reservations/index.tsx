import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, List, Navbar, Page, Tab, Tabs, Toolbar } from 'framework7-react';
import { getReservations } from '@api';
import { Reservation } from '@constants';
import ReservationCardList from '@components/reservations/ReservationCardList';

const ReservationIndexPage = ({ f7router }) => {
  const [beforeReservations, setBeforeReservations] = useState([]);
  const [approvedReservations, setApprovedReservations] = useState([]);
  const [rejectedReservations, setRejectedReservations] = useState([]);
  const { data: reservations, error } = useQuery<Reservation[]>('reservations', getReservations(), {
    onSuccess: (res) => {
      separateReseravtion(res);
    },
  });

  function separateReseravtion(reservations) {
    setBeforeReservations(reservations.filter((reservation) => reservation.status === 'before'));
    setApprovedReservations(reservations.filter((reservation) => reservation.status === 'approved'));
    setRejectedReservations(reservations.filter((reservation) => reservation.status === 'rejected'));
  }

  return (
    <Page noToolbar>
      <Navbar title="내 예약" backLink noShadow noHairline innerClassName="bg-white" />
      <Toolbar tabbar top className="reservation-index-toolbar" style={{ backgroundColor: 'white' }}>
        <Link
          tabLink="#tab-all"
          tabLinkActive
          className="text-theme-gray text-center text-font-bold text-md"
          style={{ justifyContent: 'flex-end' }}
        >
          <div className="tab-border border-theme-black">전체</div>
        </Link>
        <Link
          tabLink="#tab-approved"
          className="text-theme-gray text-center text-font-bold text-md"
          style={{ justifyContent: 'flex-end' }}
        >
          <div className="tab-border border-theme-black">확정</div>
        </Link>
        <Link
          tabLink="#tab-before"
          className="text-theme-gray text-center text-font-bold text-md"
          style={{ justifyContent: 'flex-end' }}
        >
          <div className="tab-border border-theme-black">대기</div>
        </Link>
        <Link
          tabLink="#tab-rejected"
          className="text-theme-gray text-center text-font-bold text-md"
          style={{ justifyContent: 'flex-end' }}
        >
          <div className="tab-border border-theme-black">거부</div>
        </Link>
      </Toolbar>
      <Tabs>
        <Tab id="tab-all" tabActive className="overflow-scroll">
          <List accordionList className="mt-3">
            {reservations ? <ReservationCardList reservations={reservations} /> : <div>아직 예약내역이 없어요!</div>}
          </List>
        </Tab>
        <Tab id="tab-approved" className="overflow-scroll">
          <List accordionList className="mt-3">
            {approvedReservations.length > 0 ? (
              <ReservationCardList reservations={approvedReservations} />
            ) : (
              <div>아직 예약내역이 없어요!</div>
            )}
          </List>
        </Tab>
        <Tab id="tab-before" className="overflow-scroll">
          <List accordionList className="mt-3">
            {beforeReservations.length > 0 ? (
              <ReservationCardList reservations={beforeReservations} />
            ) : (
              <div>아직 예약내역이 없어요!</div>
            )}
          </List>
        </Tab>
        <Tab id="tab-rejected" className="overflow-scroll">
          <List accordionList className="mt-3">
            {rejectedReservations.length > 0 ? (
              <ReservationCardList reservations={rejectedReservations} />
            ) : (
              <div>아직 예약내역이 없어요!</div>
            )}
          </List>
        </Tab>
      </Tabs>
    </Page>
  );
};
export default React.memo(ReservationIndexPage);
