import React, { useState } from 'react';
import { f7, Navbar, Page, Row, Col } from 'framework7-react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { sleep } from '@utils';
import { PageRouteProps } from '@constants';
import { useMutation } from 'react-query';
import { postFindOrChangePassword } from '@api';
import i18next from 'i18next';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import SheetAlert from '@components/shared/SheetAlert';

interface FormValues {
  email: string;
  phone: string;
  password: string;
  password_confirmation?: string;
}

const ChangePasswordPage = ({ f7route, f7router }: PageRouteProps) => {
  const { email, phone } = f7route.query;
  const result = f7route.query.result === 'true';
  const provider = f7route.query.provider === 'null' ? null : f7route.query.provider;
  const [changeResult, setChangeResult] = useState<{ result: boolean; provider: string }>({
    result,
    provider,
  });
  const [changeYes, setChangeYes] = useState<boolean>((result && !!provider) || !result);
  const changePasswordMutation = useMutation(postFindOrChangePassword());
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [passwordConfirmationShow, setPasswordConfirmationShow] = useState<boolean>(false);
  const [alertSheetOpened, setAlertSheetOpened] = useState<boolean>(false);

  const initialValues: FormValues = {
    email,
    phone,
    password: '',
    password_confirmation: '',
  };

  const FindEmailSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, '길이가 너무 짧습니다')
      .max(16, '길이가 너무 깁니다')
      .required('필수 입력사항 입니다')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{6,16}$/,
        '영문, 숫자, 특수문자가 포함되어야 합니다',
      ),
    password_confirmation: Yup.string()
      .min(6, '길이가 너무 짧습니다')
      .max(16, '길이가 너무 깁니다')
      .required('필수 입력사항 입니다')
      .oneOf([Yup.ref('password'), null], '비밀번호가 일치하지 않습니다'),
  });

  const resultHTML = () => {
    let message = '';
    if (changeResult.provider) {
      message = `${
        i18next.t('enum').provider[`${changeResult.provider}`] as string
      } 로그인을 사용중입니다.(비밀번호 없이 해당 수단으로 로그인 가능) 비밀번호를 분실하신 경우, 각 서비스에서 제공되는 비밀번호 찾기를 이용해주세요.`;
    } else if (changeResult.result) {
      message = '비밀번호가 성공적으로 재설정되었습니다.';
    } else {
      message = '일치하는 정보가 없습니다.';
    }
    return message;
  };

  const resultButton = () => (
    <>
      <Row className="p-6">
        <Col tag="span">
          <button
            onClick={() => {
              if (changeResult.result && !changeResult.provider) {
                f7router.navigate('/users/agree');
              } else {
                f7router.back();
              }
            }}
            className="py-2 text-font-bold text-sm text-theme-black bg-white border-2 border-theme-gray-light rounded-full"
          >
            {changeResult.result && !changeResult.provider ? '회원가입' : '비밀번호찾기'}
          </button>
        </Col>
        <Col tag="span">
          <button
            onClick={() => {
              f7router.back('/users/sign_in', { force: true });
            }}
            className="py-2 text-font-bold text-sm text-theme-black bg-theme-gray-light rounded-full"
          >
            로그인
          </button>
        </Col>
      </Row>
    </>
  );

  return (
    <Page noToolbar>
      <Navbar title="비밀번호찾기" backLink noHairline innerClassName="bg-white" />
      <SheetAlert
        sheetOpened={alertSheetOpened}
        setSheetOpened={setAlertSheetOpened}
        content="에러가 발생했습니다"
        btnText="확인"
      />
      {changeYes ? (
        <div className="p-6">
          <div className="text-theme-black text-font-bold">비밀번호</div>
          <div className="text-sm">{resultHTML()}</div>
          {resultButton()}
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={FindEmailSchema}
          onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
            await sleep(400);
            setSubmitting(false);
            f7.dialog.preloader('잠시만 기다려주세요...');
            changePasswordMutation.mutate(
              { user: values },
              {
                onSuccess: (res) => {
                  f7.dialog.close();
                  setChangeResult(res);
                  setChangeYes(true);
                },
                onError: (error) => {
                  console.log(error);
                  f7.dialog.close();
                  setAlertSheetOpened(true);
                },
              },
            );
          }}
        >
          {({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid }) => (
            <Form>
              <div className="p-6 text-font-bold text-2xl">비밀번호를 재설정해주세요:D</div>
              <div className="px-6 text-theme-black">
                <div className="pt-4">
                  <label htmlFor="password" className="text-font-bold">
                    새로운 비밀번호
                  </label>
                  <Input
                    type={passwordShow ? 'text' : 'password'}
                    name="password"
                    id="password"
                    className="w-full"
                    placeholder="영문, 숫자, 특수문자 포함 6자 이상"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    style={{
                      border: '1px solid #E8EBF2',
                      padding: '0.5rem 1rem',
                      fontSize: '0.9rem',
                      borderRadius: '7px',
                      marginTop: '0.25rem',
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <div onClick={() => setPasswordShow((val) => !val)}>
                          {passwordShow ? (
                            <img src={showPassword} alt="" className="w-8 h-8" />
                          ) : (
                            <img src={notShowPassword} alt="" className="w-8 h-8" />
                          )}
                        </div>
                      </InputAdornment>
                    }
                  />
                  {touched.password && errors.password && (
                    <p className="text-xs text-theme-orange">{touched.password && errors.password}</p>
                  )}
                </div>
                <div className="mt-3">
                  <label htmlFor="password_confirmation" className="text-font-bold">
                    비밀번호 확인
                  </label>
                  <Input
                    type={passwordConfirmationShow ? 'text' : 'password'}
                    name="password_confirmation"
                    id="password_confirmation"
                    className="w-full"
                    placeholder="비밀번호 확인"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password_confirmation}
                    style={{
                      border: '1px solid #E8EBF2',
                      padding: '0.5rem 1rem',
                      fontSize: '0.9rem',
                      borderRadius: '7px',
                      marginTop: '0.25rem',
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <div onClick={() => setPasswordConfirmationShow((val) => !val)}>
                          {passwordConfirmationShow ? (
                            <img src={showPassword} alt="" className="w-8 h-8" />
                          ) : (
                            <img src={notShowPassword} alt="" className="w-8 h-8" />
                          )}
                        </div>
                      </InputAdornment>
                    }
                  />
                  {touched.password_confirmation && errors.password_confirmation && (
                    <p className="text-xs text-theme-orange">
                      {touched.password_confirmation && errors.password_confirmation}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="button button-fill button-large disabled:opacity-50 bg-theme-blue rounded-full mt-4 text-font-bold"
                  disabled={isSubmitting || !isValid}
                >
                  확인
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Page>
  );
};

export default React.memo(ChangePasswordPage);
