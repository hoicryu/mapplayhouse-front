import React, { useState } from 'react';
import { f7, Page, Navbar } from 'framework7-react';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import useAuth from '@hooks/useAuth';
import { loginAPI } from '@api';
import { convertObjectToFormData } from '@utils';
import { PageRouteProps } from '@constants';
import KakaoButton from '@components/users/KakaoButton';
import NaverButton from '@components/users/NaverButton';
import { useRecoilValue } from 'recoil';
import { currentMarketId } from '@atoms';

interface FormValues {
  email: string;
  password: string;
  last_market_id: number;
}

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('잘못된 이메일입니다.').required('필수 입력사항 입니다'),
  password: Yup.string()
    .min(6, '6자 이상으로 작성해주세요')
    .max(16, '16자 이하로 작성해주세요')
    .required('필수 입력사항 입니다'),
});

const SessionNewPage = ({ f7route, f7router }: PageRouteProps) => {
  const { is_main } = f7route.query;
  const { authenticateUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const marketId = useRecoilValue(currentMarketId);
  const [naverSignUpPath, setNaverSignUpPath] = useState<string>('');
  const [autoLogin, setAutoLogin] = useState<boolean>(!!window.localStorage.getItem('rememberMe'));
  const [rememberEmail, setRememberEmail] = useState<boolean>(!!window.localStorage.getItem('rememberEmail'));

  const initialValues: FormValues = {
    email: window.localStorage.getItem('rememberEmail') || '',
    password: '',
    last_market_id: marketId || 0,
  };
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
      <Navbar
        noHairline
        title={i18next.t('login.title')}
        backLink={!is_main}
        sliding={false}
        innerClassName="bg-white"
      />
      <div className="text-font-bold text-2xl px-6">
        <div className="w-full flex justify-center my-10">
          <img src={logo} alt="" width="170px" />
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={SignInSchema}
          onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
            if (rememberEmail) {
              await window.localStorage.setItem('rememberEmail', values.email);
            } else {
              await window.localStorage.removeItem('rememberEmail');
            }
            await handleLogin(values, setSubmitting);
          }}
          // validateOnMount
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid }) => (
            <form onSubmit={handleSubmit} noValidate>
              <div
                className={`rounded-full border ${
                  touched.email && errors.email ? 'border-theme-orange' : 'border-theme-gray-light'
                }`}
              >
                <input
                  name="email"
                  type="email"
                  placeholder="이메일주소를 입력해주세요."
                  autoComplete="off"
                  onChange={(e) => {
                    handleChange(e);
                    setErrorMessage(null);
                  }}
                  onBlur={handleBlur}
                  value={values.email}
                  className="w-full"
                  style={{
                    fontSize: '0.9rem',
                    borderRadius: '9999px',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#E8EBF2',
                  }}
                />
              </div>
              <div
                className={`mt-4 rounded-full border ${
                  touched.password && errors.password ? 'border-theme-orange' : 'border-theme-gray-light'
                }`}
              >
                <input
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력해주세요."
                  onChange={(e) => {
                    handleChange(e);
                    setErrorMessage(null);
                  }}
                  onBlur={handleBlur}
                  value={values.password}
                  className="w-full"
                  style={{
                    fontSize: '0.9rem',
                    borderRadius: '9999px',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#E8EBF2',
                  }}
                />
              </div>

              {touched.email &&
                touched.password &&
                !errorMessage &&
                (errors.email ? (
                  <div className="mt-1">
                    <p className="text-xs text-font-regular text-theme-orange">{touched.email && errors.email}</p>
                  </div>
                ) : (
                  <div className="mt-1">
                    <p className="text-xs text-font-regular text-theme-orange">{touched.password && errors.password}</p>
                  </div>
                ))}
              <p className="text-xs text-theme-orange">{errorMessage}</p>
              <input type="hidden" name="last_market_id" value={values.last_market_id} />
              <div className="flex mt-4">
                <div
                  className="flex text-sm text-font-regular items-center pr-8"
                  onClick={() => {
                    setAutoLogin((value) => !value);
                    if (window.localStorage.getItem('rememberMe')) {
                      window.localStorage.removeItem('rememberMe');
                    } else {
                      window.localStorage.setItem('rememberMe', 'true');
                    }
                  }}
                >
                  <img src={autoLogin ? selectCircle : unselectCircle} alt="" className="w-7 h-7 mr-2" />
                  자동 로그인
                </div>
                <div
                  className="flex text-sm text-font-regular items-center"
                  onClick={() => {
                    setRememberEmail((value) => !value);
                  }}
                >
                  <img src={rememberEmail ? selectCircle : unselectCircle} alt="" className="w-7 h-7 mr-2" />
                  아이디 저장
                </div>
              </div>
              <div className="mt-8">
                <button
                  type="submit"
                  className="button button-fill button-large w-full disabled:opacity-50 rounded-full text-sm text-font-bold bg-theme-blue m-auto"
                  disabled={isSubmitting || !isValid}
                >
                  로그인
                </button>
              </div>
            </form>
          )}
        </Formik>
        <div className="mt-4 text-sm text-center text-font-regular">
          <a href="/find_email">이메일 찾기</a>
          <span className="mx-2">|</span>
          <a href="/find_password">비밀번호 찾기</a>
          <span className="mx-2">|</span>
          <a href="/users/agree">회원가입</a>
        </div>
        <div className="mx-auto my-6 w-32 grid grid-cols-2 gap-3 ">
          <KakaoButton className="" f7router={f7router} f7route={f7route} />
          <NaverButton className="" setNaverSignUpPath={setNaverSignUpPath} />
        </div>
      </div>
    </Page>
  );
};

export default React.memo(SessionNewPage);
