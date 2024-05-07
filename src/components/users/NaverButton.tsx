import React, { useEffect, useState } from 'react';
import { f7 } from 'framework7-react';
import { oauthLoginApi } from '@api';
import useAuth from '@hooks/useAuth';
import { configs } from '@config';
import SheetAlert from '@components/shared/SheetAlert';
import naverIcon from '@assets/icons/naver.png';

declare global {
  interface Window {
    naver: any;
  }
}
interface NaverButtonProps {
  className: string;
  naverToken?: string;
  setNaverSignUpPath: any;
}

const { NAVER_SDK, NAVER_CLIENT_ID, NAVER_REDIRECT, NAVER_API_REDIRECT } = configs;

const NaverButton = ({ className, naverToken = null, setNaverSignUpPath }: NaverButtonProps) => {
  const { isAuthenticated, authenticateUser } = useAuth();
  const [alertSheetOpened, setAlertSheetOpened] = useState<boolean>(false);
  const [alertSheetContent, setAlertSheetContent] = useState<string>('');
  const NaverLoginHandler = async ({ token }) => {
    oauthLoginApi(NAVER_API_REDIRECT, { access_token: token }).then(async (res) => {
      if (res.data === 'false') {
        setAlertSheetContent(`문제가 발생했습니다. ${(<br />)} 관리자에게 문의해주세요`);
        setAlertSheetOpened(true);
      } else if (res.data?.sign_up) {
        const { user } = res.data;
        const { email, name, provider, uid } = user;
        setNaverSignUpPath(`/users/sign_up?email=${email}&name=${name}&provider=${provider}&uid=${uid}`);
      } else {
        f7.dialog.preloader('잠시만 기다려주세요...');
        await authenticateUser(res.data);
        f7.dialog.close();
        window.location.href = '/';
      }
    });
  };

  const getToken = () => {
    if (!window.location.hash || window.location.hash.startsWith('#/')) return;
    const token = window.location.hash?.split('=')[1]?.split('&')[0];
    NaverLoginHandler({ token });
  };

  const naverLoginClickHandler = () => {
    const loginButton: any = document.getElementById('naverIdLogin')?.firstChild;
    console.log(document.getElementById('naverIdLogin')?.firstChild);
    loginButton.click();
  };

  const initializeNaverLogin = () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: NAVER_CLIENT_ID,
      callbackUrl: NAVER_REDIRECT,
      loginButton: { color: 'green', type: 3 },
    });
    naverLogin.init();
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = NAVER_SDK;
    script.onload = () => initializeNaverLogin();
    document.body.appendChild(script);
    if (!isAuthenticated) getToken();
    return () => script.remove();
  }, []);

  return (
    <>
      <SheetAlert
        sheetOpened={alertSheetOpened}
        setSheetOpened={setAlertSheetOpened}
        content={alertSheetContent}
        btnText="확인"
      />
      <button className={className} onClick={naverLoginClickHandler} type="button">
        <img src={naverIcon} alt="" className="h-12 w-12" />
        <p className="text-font-regular text-sm font-medium text-white">네이버로 로그인</p>
      </button>
      <div id="naverIdLogin" className="invisible max-h-0 h-0" />
    </>
  );
};
export default NaverButton;
