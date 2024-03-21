/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useState } from 'react';
import { f7, Navbar, Page } from 'framework7-react';
import useAuth from '@hooks/useAuth';
import { IMAGE_API_URL, logoutAPI, userEditAPI } from '@api';
import { useMutation } from 'react-query';
import CommonHr from '@components/shared/CommonHr';
import SheetAlert from '@components/shared/SheetAlert';

const showPage = () => {
  const { currentUser, authenticateUser, unAuthenticateUser } = useAuth();
  const [alertSheetOpened, setAlertSheetOpened] = useState<boolean>(false);
  const [alertSheetContent, setAlertSheetContent] = useState<string>('');

  const logoutHandler = useCallback(async () => {
    try {
      await logoutAPI();
    } finally {
      unAuthenticateUser();
    }
    window.location.reload();
  }, [unAuthenticateUser]);

  const updateMutation = useMutation(userEditAPI(currentUser.id), {
    onError: (error) => {
      console.log(error);
      f7.dialog.close();
      setAlertSheetContent('에러가 발생했습니다');
      setAlertSheetOpened(true);
    },
  });

  return (
    <Page noToolbar>
      <Navbar noHairline innerClassName="bg-white" title="회원정보" backLink />
      <SheetAlert
        sheetOpened={alertSheetOpened}
        setSheetOpened={setAlertSheetOpened}
        content={alertSheetContent}
        btnText="확인"
      />
      <div className="py-5">
        <div className="flex justify-center">
          <div className="inline-grid relative mb-4">
            {currentUser.image ? (
              <img src={IMAGE_API_URL + currentUser.image_path} alt="" className="rounded-full w-12 h-12" />
            ) : (
              <img src={profile} alt="" className="rounded-full w-12 h-12 bg-theme-blue" />
            )}
            <div className="absolute right-0 bottom-0">
              <label htmlFor="changeUserProfile">
                <img src={camera} alt="" className="rounded-full w-4 h-4 bg-white shadow" />
              </label>
              <input
                type="file"
                id="changeUserProfile"
                name="image"
                hidden
                onChange={(e) => {
                  f7.dialog.preloader('잠시만 기다려주세요');
                  const formData = new FormData();
                  formData.append('user[image]', e.target.files[0]);
                  updateMutation.mutate(formData, {
                    onSuccess: async (res) => {
                      f7.dialog.close();
                      const { token, csrf } = res;
                      authenticateUser({ token, csrf });
                      setAlertSheetContent('프로필 이미지가 변경되었습니다');
                      setAlertSheetOpened(true);
                    },
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="text-theme-black text-base text-center text-font-bold">{currentUser.name}</div>
        <div className="text-theme-gray text-sm text-center text-font-bold">{currentUser.email}</div>
      </div>
      <CommonHr />
      <div className="bg-white overflow-hidden sm:rounded-md list my-0 border-t-2 border-b-2 border-theme-gray-black">
        <ul className="divide-y divide-gray-200">
          <li>
            <a href="/users/edit" className="block hover:bg-gray-50">
              <div className="flex items-center px-4 py-4 sm:px-6">
                <div className="min-w-0 flex-1 flex items-center">
                  <div className="min-w-0 flex-1 md:grid md:grid-cols-2 md:gap-4">
                    <div className="pl-2 flex justify-between">
                      <p className="text-sm text-font-bold text-theme-black truncate">회원정보 수정</p>
                      <i className="las la-angle-right" style={{ fontSize: '24px', color: 'gray' }} />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
      <div className="text-right text-theme-gray mt-2 mr-5 text-font-bold">
        <a href="#" onClick={logoutHandler} className="block hover:bg-gray-50">
          로그아웃
        </a>
      </div>
    </Page>
  );
};

export default showPage;
