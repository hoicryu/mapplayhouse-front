import { IMAGE_API_URL } from '@api';
import { dateFormat } from '@js/utils';
import React from 'react';

const GroupCard = ({ group }) => {
  return (
    <div className="w-100 mt-3 flex">
      <div className="w-30p">
        <img
          className="rounded-xl w-full object-cover aspect-ratio-4_5"
          src={IMAGE_API_URL + group.musical.image_path}
          alt=""
        />
      </div>
      <div className="ml-4 w-70p flex flex-col justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold">{group.musical._type === 'theatrical' ? '연극' : '뮤지컬'}</span>
          <span className="text-lg font-semibold">{group.musical_alias}</span>
        </div>
        <div className="flex">
          {group.main_parts.map((part, idx) => (
            <div
              className={`${idx !== 0 && 'ml-1'} px-1 py-0.5 text-xs text-gray-800 border-2 rounded-md`}
              key={`part-${part.id}`}
            >
              {part.title}
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          <span className="mt-1 text-xxs font-medium">오디션 : {dateFormat(group.audition_date, 'time')}</span>
          <span className="mt-1 text-xxs font-medium">첫수업 : {dateFormat(group.course_start_at, 'time')}</span>
        </div>
      </div>
    </div>
  );
};
export default React.memo(GroupCard);
