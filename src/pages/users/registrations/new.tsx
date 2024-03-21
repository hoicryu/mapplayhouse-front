import React, { useState } from 'react';
import { f7, Navbar, Page, Row, Col } from 'framework7-react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import PhoneCertification from '@components/shared/PhoneCertification';
import { sleep } from '@utils';
import { getCheckEmailOverlap, signupAPI } from '@api';
import useAuth from '@hooks/useAuth';
import { PageRouteProps } from '@constants';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import SheetAlert from '@components/shared/SheetAlert';

interface FormValues {
  name: string;
  email: string;
  password?: string;
  phone: string;
  provider?: string;
  uid?: string;
  recommended?: string;
}

const SignUpPage = ({ f7route, f7router }: PageRouteProps) => {
  const { isSms, email, name, provider, uid } = f7route.query;
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [emailCheck, setEmailCheck] = useState<boolean>(false);
  const [emailOverlapMessage, setEmailOverlapMessage] = useState<string>('');
  const [alertSheetOpened, setAlertSheetOpened] = useState<boolean>(false);
  const [alertSheetContent, setAlertSheetContent] = useState<string>('');
  const { authenticateUser } = useAuth();
  const initialValues: FormValues =
    provider && provider !== 'undefined'
      ? {
          name: name || '',
          email: email || '',
          phone: '',
          provider,
          uid,
          recommended: '',
        }
      : {
          name: '',
          email: '',
          password: '',
          phone: '',
          recommended: '',
        };
  const SignUpSchema =
    provider && provider !== 'undefined'
      ? Yup.object().shape({
          name: Yup.string().required('필수 입력사항 입니다'),
          email: Yup.string().email('이메일 주소를 확인해주세요.').required('필수 입력사항 입니다.'),
          phone: Yup.string()
            .min(9, '길이가 너무 짧습니다.')
            .max(15, '길이가 너무 깁니다.')
            .required('휴대폰 번호를 인증해주세요.'),
          provider: Yup.string().required('필수 입력사항 입니다.'),
          uid: Yup.string().required('필수 입력사항 입니다.'),
          recommended: Yup.string().email('이메일 주소를 확인해주세요.'),
        })
      : Yup.object().shape({
          name: Yup.string().required('필수 입력사항 입니다'),
          email: Yup.string().email('이메일 주소를 확인해주세요.').required('필수 입력사항 입니다.'),
          password: Yup.string()
            .min(6, '6자 이상으로 작성해주세요')
            .max(16, '16자 이하로 작성해주세요')
            .required('필수 입력사항 입니다.')
            .matches(
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{6,16}$/,
              '영문, 숫자, 특수문자가 포함되어야 합니다',
            ),
          phone: Yup.string()
            .min(9, '길이가 너무 짧습니다.')
            .max(15, '길이가 너무 깁니다.')
            .required('휴대폰 번호를 인증해주세요.'),
          recommended: Yup.string().email('이메일 주소를 확인해주세요.'),
        });

  return (
    <Page noToolbar>
      <Navbar title="회원가입" backLink sliding={false} noHairline innerClassName="bg-white" />
      <SheetAlert
        sheetOpened={alertSheetOpened}
        setSheetOpened={setAlertSheetOpened}
        content={alertSheetContent}
        btnText="확인"
      />
      <Formik
        initialValues={initialValues}
        validationSchema={SignUpSchema}
        onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
          await sleep(400);
          setSubmitting(false);
          f7.dialog.preloader('잠시만 기다려주세요...');
          try {
            const { data: user } = await signupAPI({ ...values });
            f7.dialog.close();
            if (user.error) {
              setAlertSheetContent(user.error);
              setAlertSheetOpened(true);
            } else {
              authenticateUser(user);
              await window.location.reload();
            }
          } catch (error) {
            f7.dialog.close();
            setAlertSheetContent(error?.response?.data || error?.message);
            setAlertSheetOpened(true);
          }
        }}
        validateOnMount
        // enableReinitialize
      >
        {({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid }) => (
          <Form>
            <div className="pl-6 py-6 text-font-bold text-2xl">가입해주셔서 감사해요:)</div>
            <div className="px-6">
              <div className="my-3">
                <label htmlFor="name" className="text-font-bold text-theme-black text-sm">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="이름을 입력해주세요"
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  className="mt-1"
                  style={{
                    width: '100%',
                    border: `${touched.name && errors.name ? '1px solid #FF9920' : '1px solid #E8EBF2'}`,
                    borderRadius: '0.5rem',
                    padding: '0.6rem',
                    fontSize: '0.8rem',
                    color: '#191919',
                  }}
                />
                {touched.name && errors.name && (
                  <div className="mt-1">
                    <p className="text-xs text-theme-orange">{errors.name}</p>
                  </div>
                )}
              </div>
              <div className="my-3">
                <label htmlFor="email" className="text-font-bold text-theme-black text-sm">
                  이메일
                </label>
                <Row className="items-center mt-1">
                  <Col width="75">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="로그인 시 필요합니다"
                      autoComplete="off"
                      onChange={(e) => {
                        handleChange(e);
                        setEmailOverlapMessage(null);
                      }}
                      onBlur={(e) => {
                        handleBlur(e);
                        setEmailOverlapMessage('이메일 중복체크를 해주세요');
                      }}
                      value={values.email}
                      className="mt-1"
                      style={{
                        width: '100%',
                        border: `${touched.email && errors.email ? '1px solid #FF9920' : '1px solid #E8EBF2'}`,
                        borderRadius: '0.5rem',
                        padding: '0.6rem',
                        fontSize: '0.8rem',
                        color: '#191919',
                      }}
                    />
                  </Col>
                  <Col width="25">
                    <button
                      onClick={async () => {
                        const emailPresent = await getCheckEmailOverlap({ email: values.email });
                        setEmailCheck(!emailPresent);
                        if (emailPresent) {
                          setEmailOverlapMessage('사용 중인 이메일입니다.');
                        } else {
                          setEmailOverlapMessage('사용 가능한 아이디입니다.');
                        }
                      }}
                      type="button"
                      id="cert-button"
                      className="text-font-bold px-2 button button-fill text-xs text-theme-black bg-theme-gray-light disabled:opacity-50 rounded-full"
                      disabled={!!errors.email}
                    >
                      중복체크
                    </button>
                  </Col>
                  {((touched.email && errors.email) || emailOverlapMessage) && (
                    <div className="mt-1">
                      <p className={`text-xs ${errors.email || !emailCheck ? 'text-theme-orange' : 'text-theme-blue'}`}>
                        {errors.email || emailOverlapMessage}
                      </p>
                    </div>
                  )}
                </Row>
              </div>
              {provider && provider === 'undefined' && (
                <>
                  <div className="my-3">
                    <label htmlFor="password" className="text-font-bold text-theme-black text-sm">
                      비밀번호
                    </label>
                    <Input
                      type={passwordShow ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="영문, 숫자, 특수문자 포함 6자 이상"
                      autoComplete="off"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      readOnly={!(provider && provider === 'undefined')}
                      className="mt-1"
                      style={{
                        width: '100%',
                        marginTop: '0.5rem',
                        border: `${touched.password && errors.password ? '1px solid #FF9920' : '1px solid #E8EBF2'}`,
                        borderRadius: '0.5rem',
                        padding: '0.6rem',
                        fontSize: '0.8rem',
                        color: '#191919',
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
                      <div className="mt-1">
                        <p className="text-xs text-theme-orange">{errors.password}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              <PhoneCertification setConfirmed={setConfirmed} signup />
              <hr className="my-5" />
              <div className="my-3">
                <label htmlFor="password" className="text-font-bold text-theme-black text-sm">
                  추천인
                </label>
                <input
                  type="email"
                  id="recommended"
                  name="recommended"
                  placeholder="집마켓을 추천해주신 분의 이메일주소를 입력해주세요 :O"
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.recommended}
                  className="mt-1"
                  style={{
                    width: '100%',
                    marginTop: '0.5rem',
                    border: `${touched.recommended && errors.recommended ? '1px solid #FF9920' : '1px solid #E8EBF2'}`,
                    borderRadius: '0.5rem',
                    padding: '0.6rem',
                    fontSize: '0.8rem',
                    color: '#191919',
                  }}
                />
                {touched.recommended && errors.recommended && (
                  <div className="mt-1">
                    <p className="text-xs text-theme-orange">{errors.recommended}</p>
                  </div>
                )}
              </div>

              <input type="hidden" name="user[accept_sms]" value={isSms} />
              <div className="pt-4">
                <button
                  type="submit"
                  className="button button-fill button-large disabled:opacity-50 bg-theme-blue rounded-full text-font-bold"
                  disabled={isSubmitting || !isValid || !confirmed || !emailCheck}
                >
                  회원가입
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(SignUpPage);
