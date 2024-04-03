import React, { useEffect, useState } from 'react';
import { f7, Navbar, Page, Row, Col } from 'framework7-react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import PhoneCertification from '@components/shared/PhoneCertification';
import { sleep } from '@utils';
import { getCheckEmailOverlap, signupAPI } from '@api';
import useAuth from '@hooks/useAuth';
import { PageRouteProps } from '@constants';
import SheetAlert from '@components/shared/SheetAlert';

interface FormValues {
  name: string;
  email: string;
  password?: string;
  phone: string;
  provider?: string;
  uid?: string;
  recommended?: string;
  privacy: boolean;
  age: boolean;
}

const SignUpPage = ({ f7route, f7router }: PageRouteProps) => {
  const { email, name, provider, uid } = f7route.query;
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const [alertSheetOpened, setAlertSheetOpened] = useState<boolean>(false);
  const [alertSheetContent, setAlertSheetContent] = useState<string>('');
  const { authenticateUser } = useAuth();
  useEffect(() => {
    if (!!window.location.hash && !window.location.hash.startsWith('#/')) window.location.hash = '';
  }, []);

  const initialValues: FormValues = {
    name: name || '',
    email: email || '',
    phone: '',
    provider,
    uid,
    recommended: '',
    privacy: false,
    age: false,
  };

  const SignUpSchema = Yup.object().shape({
    name: Yup.string().required('필수 입력사항 입니다'),
    phone: Yup.string()
      .min(9, '길이가 너무 짧습니다.')
      .max(15, '길이가 너무 깁니다.')
      .required('휴대폰 번호를 인증해주세요.'),
  });

  return (
    <Page noToolbar>
      <Navbar title="가입하기" backLink sliding={false} noHairline innerClassName="bg-white" />
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
      >
        {({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid }) => (
          <Form>
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
              <PhoneCertification setConfirmed={setConfirmed} signup />
              <hr className="my-5" />
              <div className="pt-4">
                <button
                  type="submit"
                  className="button button-fill button-large disabled:opacity-50 bg-theme-blue rounded-full text-font-bold"
                  disabled={isSubmitting || !isValid || !confirmed}
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
