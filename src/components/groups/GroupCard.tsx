import { IMAGE_API_URL } from '@api';
import { customToastState } from '@atoms';
import useAuth from '@hooks/useAuth';
import { dateFormat } from '@js/utils';
import React from 'react';
import { useRecoilState } from 'recoil';
import { Router } from 'framework7/types';
import { Group } from '@constants';

interface GroupCardProps {
  group: Group;
  f7router: Router.Router;
}

const GroupCard = ({ group, f7router }: GroupCardProps) => {
  const { currentUser } = useAuth();
  const [openCustomToast, setOpenCustomToast] = useRecoilState(customToastState);

  const handleOnCardClick = () => {
    const isApplied = currentUser.groups_i_applied.includes(group.id);
    if (!isApplied) {
      f7router.navigate(`/application_forms/new?group_id=${group.id}`);
    } else {
      setOpenCustomToast({ ...openCustomToast, content: '이미 신청한 작품입니다.', open: true });
    }
  };

  return (
    <a className="w-100 mt-3 flex" href="#" onClick={handleOnCardClick}>
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
          <span className="text-lg ml-none font-semibold">{group.musical_alias}</span>
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
          <span className="mt-1 ml-none text-xxs font-medium">
            첫수업 : {dateFormat(group.course_start_at, 'time')}
          </span>
        </div>
      </div>
    </a>
  );
};
export default React.memo(GroupCard);
