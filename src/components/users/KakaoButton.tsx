import React, { useEffect, useState } from 'react';
import { f7 } from 'framework7-react';
import { oauthLoginApi } from '@api';
import { PageRouteProps } from '@constants';
import useAuth from '@hooks/useAuth';
import SheetAlert from '@components/shared/SheetAlert';

declare global {
  interface Window {
    Kakao: any;
  }
}
interface KakaoButtonProps extends PageRouteProps {
  className: string;
}
const KAKAO_SDK = 'https://developers.kakao.com/sdk/js/kakao.js';
const KAKAO_TOKEN = 'da7b40a3bd3c5f6a4a51b458f5297687';
const KAKAO_REDIRECT = '/users/auth/kakao';

const KakaoButton = ({ className, f7route, f7router }: KakaoButtonProps) => {
  const [alertSheetOpened, setAlertSheetOpened] = useState<boolean>(false);
  const [alertSheetContent, setAlertSheetContent] = useState<string>('');
  const { authenticateUser } = useAuth();

  const kakaoLoginClickHandler = () => {
    window.Kakao.Auth.login({
      success: (authObject) => {
        oauthLoginApi(KAKAO_REDIRECT, { access_token: authObject.access_token }).then((res) => {
          if (res.data === 'false') {
            setAlertSheetContent(`문제가 발생했습니다. ${(<br />)} 관리자에게 문의해주세요`);
            setAlertSheetOpened(true);
          } else if (res.data.sign_up) {
            const { user } = res.data;
            const { email, name, provider, uid } = user;
            f7router.navigate(`/users/agree?email=${email}&name=${name}&provider=${provider}&uid=${uid}`);
          } else {
            authenticateUser(res.data);
            window.location.reload();
          }
        });
      },
      fail: (err) => {
        setAlertSheetContent(JSON.stringify(err));
        setAlertSheetOpened(true);
      },
    });
  };

  const initializeKakaoLogin = () => {
    if (!window.Kakao.isInitialized()) {
      // javascript key 를 이용하여 initialize
      window.Kakao.init(KAKAO_TOKEN);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = KAKAO_SDK;
    script.onload = () => initializeKakaoLogin();
    document.body.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <>
      <SheetAlert
        sheetOpened={alertSheetOpened}
        setSheetOpened={setAlertSheetOpened}
        content={alertSheetContent}
        btnText="닫기"
      />
      <div>
        <button className={className} onClick={kakaoLoginClickHandler} type="button" id="kakaoIdLogin">
          <img src={kakaoIcon} alt="" className="h-12 w-12 m-auto" />
          <p className="text-font-regular text-xs">카카오</p>
        </button>
      </div>
    </>
  );
};
export default KakaoButton;
