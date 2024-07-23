import React, { useState } from 'react';
import { dateFormat } from '@js/utils';
import i18next from 'i18next';
import { AccordionContent, AccordionItem, AccordionToggle, Icon } from 'framework7-react';

const ReservationsCardList = ({ reservations }) => {
  const [isOpen, setIsOpen] = useState(false);

  function toggleAccordion() {
    setIsOpen(!isOpen);
  }

  function getBadgeColor(status) {
    if (status === 'before') return 'bg-white border-theme text-theme';
    if (status == 'approved') return 'bg-green-400 text-white border border-bg-green-400';
    if (status == 'rejected') return 'bg-red-400 text-white border border-bg-red-400';
  }

  return reservations?.map((reservation) => (
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
        {reservation.status === 'rejected' && (
          <AccordionItem>
            <AccordionToggle className="mt-1.5 text-xs">
              <div onClick={toggleAccordion}>
                <span className="text-red-500">거부사유 보기</span>
                <Icon f7={isOpen ? 'chevron_up' : 'chevron_down'} size="15px" color="red" className="ml-2" />
              </div>
            </AccordionToggle>
            <AccordionContent>
              <div className="mt-1.5 text-xs">거부 사유 : {reservation.reason_for_rejection}</div>
            </AccordionContent>
          </AccordionItem>
        )}
      </div>
      <span className={`py-1 px-2 shadow text-xxs font-medium rounded-xl ${getBadgeColor(reservation.status)}`}>
        {i18next.t('enum')['reservation']['status'][reservation.status]}
      </span>
    </div>
  ));
};
export default React.memo(ReservationsCardList);
