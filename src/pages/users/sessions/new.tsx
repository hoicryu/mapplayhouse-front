import React, { useState } from 'react';
import { Page, Navbar } from 'framework7-react';
import useAuth from '@hooks/useAuth';
import { loginAPI } from '@api';
import { convertObjectToFormData } from '@utils';
import { PageRouteProps } from '@constants';
import KakaoButton from '@components/users/KakaoButton';
import NaverButton from '@components/users/NaverButton';
import defaultImg from '@assets/icons/mapmark.png';
import i18next from 'i18next';

const SessionNewPage = ({ f7route, f7router }: PageRouteProps) => {
  const { is_main } = f7route.query;
  const { authenticateUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [naverSignUpPath, setNaverSignUpPath] = useState<string>('');

  const handleLogin = async (params, setSubmitting) => {
    setSubmitting(true);
    try {
      const fd = convertObjectToFormData({ modelName: 'user', data: params });
      const response = await loginAPI(fd);
      authenticateUser(response.data);
      await window.location.reload();
    } catch (error) {
      setErrorMessage(error.response.data);
      setSubmitting(false);
    }
  };
  return (
    <Page
      className="bg-white"
      noToolbar={!is_main}
      onPageAfterIn={() => {
        if (!!window.location.hash && !!naverSignUpPath) f7router.navigate(naverSignUpPath);
      }}
    >
      <Navbar noHairline sliding={false} innerClassName="bg-theme" />
      <div className="w-full h-full flex flex-col justify-center">
        <div className="w-full flex justify-center">
          <div className="w-36 p-2 rounded-sm">
            <img src={defaultImg} alt="#" className="h-auto rounded-2xl" />
          </div>
        </div>
        <div className="my-8 text-font-bold text-2xl flex flex-col items-center">
          <KakaoButton
            className="flex justify-center items-center w-72 kakao-back rounded-md"
            f7router={f7router}
            f7route={f7route}
          />

          <NaverButton
            className="mt-2 flex justify-center items-center w-72 naver-back rounded-md"
            setNaverSignUpPath={setNaverSignUpPath}
          />
        </div>
      </div>
    </Page>
  );
};

export default React.memo(SessionNewPage);
