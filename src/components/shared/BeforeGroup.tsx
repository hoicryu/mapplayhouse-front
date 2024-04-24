import { getBeforePerformGroup, IMAGE_API_URL } from '@api';
import { Group } from '@constants';
import React from 'react';
import { useQuery } from 'react-query';
import { dateFormat } from '@js/utils';

const BeforeGroup: React.FC<any> = ({ inView }) => {
  const { data: group, isError, isSuccess } = useQuery<Group>('beforeGroup', getBeforePerformGroup());
  if (isError) {
    return (
      <div className="h-32 flex items-center justify-center">
        <span className="text-theme-gray">서버에 문제가 발생 했습니다. </span>
      </div>
    );
  }
  return (
    <>
      {isSuccess && (
        <div className="relative h-3/5 max-h-96 w-full">
          <img src={IMAGE_API_URL + group.musical?.image_path} alt="#" className="h-full object-cover" />
          <div className="absolute top-0 left-0 w-full h-full bg-trans-black"></div>
          <div className="z-30 absolute bottom-5 left-5 text-white">
            <p className="text-xl font-bold">{group?.musical_alias}</p>
            <p className="text-sm font-medium">{group?.concert_hall}</p>
            <p className="text-xs font-medium">
              {`${dateFormat(group?.performance_start_at, 'day')} ~ ${dateFormat(group?.performance_end_at, 'day')}`}
            </p>
          </div>
          {group?.application_link && (
            <a
              href="#"
              target={group?.application_link ? '_blank' : ''}
              className="z-50 absolute bottom-5 right-5 text-lg text-white font-bold"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                if (group?.application_link) window.open(group.application_link);
              }}
            >
              보러가기
            </a>
          )}
        </div>
      )}
    </>
  );
};
export default React.memo(BeforeGroup);
