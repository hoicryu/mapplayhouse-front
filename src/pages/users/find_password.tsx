import React, { useState, useCallback } from 'react';
import { f7, Navbar, Page, List, ListInput } from 'framework7-react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import PhoneCertification from '@components/shared/PhoneCertification';
import { sleep } from '@utils';
import { PageRouteProps } from '@constants';
import { postFindOrChangePassword } from '@api';
import { useMutation } from 'react-query';

interface FormValues {
  email: string;
  phone: string;
}
const FindPasswordPage = ({ f7route, f7router }: PageRouteProps) => {
  const [certComplete, setCertComplete] = useState(false);

  const findPasswordMutation = useMutation(postFindOrChangePassword());

  const initialValues: FormValues = {
    email: '',
    phone: '',
  };

  const FindEmailSchema = Yup.object().shape({
    email: Yup.string().email('잘못된 이메일입니다').required('이메일을 입력해주세요'),
    phone: Yup.string()
      .min(9, '길이가 너무 짧습니다')
      .max(15, '길이가 너무 깁니다')
      .required('휴대폰 번호를 인증해주세요'),
  });
  return (
    <Page noToolbar>
      <Navbar title="비밀번호찾기" backLink noHairline innerClassName="bg-white" />
      <Formik
        initialValues={initialValues}
        validationSchema={FindEmailSchema}
        onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
          await sleep(400);
          setSubmitting(false);
          f7.dialog.preloader('잠시만 기다려주세요...');
          findPasswordMutation.mutate(
            { user: values },
            {
              onSuccess: (res) => {
                f7.dialog.close();
                const { result, provider } = res;
                f7router.navigate(
                  `/change_password?result=${result}&provider=${provider}&email=${values.email}&phone=${values.phone}`,
                );
              },
            },
          );
        }}
      >
        {({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid }) => (
          <Form>
            <div className="p-6 text-2xl text-font-bold">비밀번호를 잊어버리셨나요?</div>
            <div className="px-6 text-theme-black">
              <div className="pt-4">
                <label htmlFor="email" className="text-font-bold">
                  이메일
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full"
                  placeholder="이메일주소를 입력해주세요"
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  style={{
                    border: '1px solid #E8EBF2',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    borderRadius: '7px',
                    marginTop: '0.25rem',
                  }}
                />
                {touched.email && errors.email && (
                  <p className="text-xs text-theme-orange">{touched.email && errors.email}</p>
                )}
              </div>
              <PhoneCertification setConfirmed={setCertComplete} />
              <div className="pt-4">
                <button
                  type="submit"
                  className="button button-fill button-large disabled:opacity-50 bg-theme-blue rounded-full text-font-bold"
                  disabled={isSubmitting || !isValid || !certComplete}
                >
                  확인
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(FindPasswordPage);
