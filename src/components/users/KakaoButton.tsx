import React, { useEffect, useState } from 'react';
import { oauthLoginApi } from '@api';
import { PageRouteProps } from '@constants';
import useAuth from '@hooks/useAuth';
import SheetAlert from '@components/shared/SheetAlert';
import kakaoIcon from '@assets/icons/kakao.png';
import { configs } from '@config';

declare global {
  interface Window {
    Kakao: any;
  }
}
interface KakaoButtonProps extends PageRouteProps {
  className: string;
}

const KakaoButton = ({ className, f7route, f7router }: KakaoButtonProps) => {
  const [alertSheetOpened, setAlertSheetOpened] = useState<boolean>(false);
  const [alertSheetContent, setAlertSheetContent] = useState<string>('');
  const { authenticateUser } = useAuth();

  const { KAKAO_REDIRECT, KAKAO_SDK, KAKAO_TOKEN } = configs;

  const kakaoLoginClickHandler = () => {
    window.Kakao.Auth.login({
      success: (authObject) => {
        oauthLoginApi(KAKAO_REDIRECT, { access_token: authObject.access_token }).then((res) => {
          if (res.data === false) {
            setAlertSheetContent(`문제가 발생했습니다. ${(<br />)} 관리자에게 문의해주세요`);
            setAlertSheetOpened(true);
          } else if (res.data.sign_up) {
            const { user } = res.data;
            const { email, name, provider, uid } = user;
            f7router.navigate(`/users/sign_up?email=${email}&name=${name}&provider=${provider}&uid=${uid}`);
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
    3;
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
          <img src={kakaoIcon} alt="" className="h-12 w-12" />
          <p className="text-font-regular text-sm font-medium">카카오로 로그인</p>
        </button>
      </div>
    </>
  );
};
export default KakaoButton;
