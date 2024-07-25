import React from 'react';
import { IMAGE_API_URL } from '@api';
import { FaUserCircle } from 'react-icons/fa';
import settingImg from '@assets/icons/settings2.png';
import useAuth from '@hooks/useAuth';

const ProfileCard = () => {
  const { currentUser } = useAuth();
  return (
    <>
      <div className="mt-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <a href={`/users/${currentUser?.id}`}>
            <div className="relative">
              {currentUser?.image_path ? (
                <img className="h-16 w-16 rounded-full" src={IMAGE_API_URL + currentUser?.image_path} alt="" />
              ) : (
                <FaUserCircle style={{ fontSize: '80px', color: 'gray' }} />
              )}
              <span className="absolute inset-0 shadow-inner rounded-full" aria-hidden="true" />
            </div>
          </a>
          <h1 className="ml-5 text-base font-bold text-gray-900">{currentUser?.name}</h1>
        </div>
        <a href="/settings" className="px-3 py-2 border rounded-2xl">
          <img src={settingImg} alt="" className="h-4 w-4" />
        </a>
      </div>
      <div className="mt-5 flex justify-center items-center flex-col">
        <div className="mt-2 w-3/4 flex justify-center">
          <div className="mx-5 w-1/3 flex flex-col items-center">
            <span className="text-xs text-gray-400">메인 배역</span>
            <div className="mt-1 text-sm font-semibold">
              <span className="text-theme">3</span>
              <span className="ml-1">회</span>
            </div>
          </div>
          <div className="mx-5 w-1/3 flex flex-col items-center">
            <span className="text-xs text-gray-400">조연</span>
            <div className="mt-1 text-sm font-semibold">
              <span className="text-theme">5</span>
              <span className="ml-1">회</span>
            </div>
          </div>
          <div className="mx-5 w-1/3 flex flex-col items-center">
            <span className="text-xs text-gray-400">앙상블</span>
            <div className="mt-1 text-sm font-semibold">
              <span className="text-theme">10</span>
              <span className="ml-1">회</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default React.memo(ProfileCard);
