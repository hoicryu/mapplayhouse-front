import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Page, Sheet } from 'framework7-react';
import { getObjects } from '@api';
import * as Yup from 'yup';
import { Objects, PageRouteProps } from '@constants';
import { useQuery } from 'react-query';
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';

interface FormValues {
  privacy: boolean;
  age: boolean;
}

const AgreeSchema = Yup.object({
  privacy: Yup.boolean().oneOf([true], '개인정보수집 및 이용동의 항목을 체크해주세요.'),
  age: Yup.boolean().oneOf([true], '만 14세 이상만 가입 가능합니다 항목을 체크해주세요.'),
});

const AgreePage = ({ f7route, f7router }: PageRouteProps) => {
  const initialValues: FormValues = {
    privacy: false,
    age: false,
  };
  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const [sheetOpened, setSheetOpened] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);

  useEffect(() => {
    if (!!window.location.hash && !window.location.hash.startsWith('#/')) window.location.hash = '';
  }, []);

  const onClickAgreeAll = () => {
    setAgreeAll((val) => !val);
    formikRef.current.setValues({
      tos: !agreeAll,
      privacy: !agreeAll,
      location: !agreeAll,
      sms: !agreeAll,
      age: !agreeAll,
    });
  };

  const onClickAgree = async (name, checked) => {
    await formikRef.current.setFieldValue(name, checked);
    await setAgreeAll(Object.values(formikRef.current.values).every((val) => val));
  };

  return (
    <Page noToolbar>
      <Navbar title="회원가입" backLink noHairline innerClassName="bg-white" />

      <Sheet
        onSheetClosed={() => setSheetOpened(false)}
        className="h-2/3 w-100 rounded-t-3xl shadow-2xl map-modal-sheet"
        closeByOutsideClick
        opened={sheetOpened}
      >
        <div className="border-gray-200 border-2 w-20 m-auto my-5" />
        <div className="text-theme-blue ml-3 text-2xl">집마켓 이용약관</div>
        <div className="border-gray-200 border w-5/6 m-auto mt-5" />
        {/* <div className="p-5 overflow-sroll h-full whitespace-pre-wrap w-100">{currentTerm?.content}</div> */}
        <div className="p-5 overflow-sroll h-full whitespace-pre-wrap w-100" />
      </Sheet>

      <div className="p-4">
        <div className="text-font-bold text-2xl mt-2">약관 동의를 해주실래요?</div>
        <div className="mt-5 mb-2 text-font-bold flex justify-between">
          전체동의
          <div className="w-7 h-7" onClick={() => onClickAgreeAll()}>
            클릭
          </div>
        </div>
        <hr className="border-black mb-5" />
        <Formik
          initialValues={initialValues}
          validationSchema={AgreeSchema}
          innerRef={formikRef}
          onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
            setSubmitting(false);
            const { email, name, provider, uid } = f7route.query;
            f7router.navigate(
              `/users/sign_up?isSms=${values.sms}&email=${email}&name=${name}&provider=${provider}&uid=${uid}`,
            );
          }}
          validateOnMount
        >
          {({ handleChange, handleBlur, setFieldValue, values, errors, touched, isSubmitting, isValid }) => (
            <Form>
              <div className="flex justify-between my-2">
                <a href="" className="underline link text-theme-gray">
                  (필수) 개인정보수집 및 이용동의
                </a>
                <label htmlFor="privacy"></label>
                <input
                  type="checkbox"
                  name="privacy"
                  id="privacy"
                  onChange={(e) => {
                    onClickAgree('privacy', e.target.checked);
                  }}
                  onBlur={handleBlur}
                  checked={values.privacy}
                  className="hidden"
                />
              </div>
              <div className="flex justify-between my-2">
                <a href="" className="underline link text-theme-gray">
                  (안내) 만 14세 이상만 가입 가능합니다.
                </a>
                <label htmlFor="age">
                  <img alt="" className="w-7 h-7" />
                </label>
                <input
                  type="checkbox"
                  name="age"
                  id="age"
                  onChange={(e) => {
                    onClickAgree('age', e.target.checked);
                  }}
                  onBlur={handleBlur}
                  checked={values.age}
                  className="hidden"
                />
              </div>
              <button
                type="submit"
                className="button button-fill button-large w-full disabled:opacity-50 mt-8 rounded-full text-sm text-font-bold bg-theme-blue m-auto"
                disabled={isSubmitting || !isValid}
              >
                확인
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </Page>
  );
};

export default React.memo(AgreePage);
