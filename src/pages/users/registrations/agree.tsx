import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Page, Sheet } from 'framework7-react';
import { getObjects } from '@api';
import * as Yup from 'yup';
import { Formik, Form, FormikHelpers } from 'formik';
import { Objects, PageRouteProps, Term } from '@constants';
import { useQuery } from 'react-query';

interface FormValues {
  tos: boolean;
  privacy: boolean;
  location: boolean;
  sms: boolean;
  age: boolean;
}

const AgreeSchema = Yup.object({
  tos: Yup.boolean().oneOf([true], '집마켓 이용약관 안내 항목을 체크해주세요.'),
  privacy: Yup.boolean().oneOf([true], '개인정보수집 및 이용동의 항목을 체크해주세요.'),
  location: Yup.boolean().oneOf([true], '위치기반서비스 이용약관 항목을 체크해주세요.'),
  sms: Yup.boolean(),
  age: Yup.boolean().oneOf([true], '만 14세 이상만 가입 가능합니다 항목을 체크해주세요.'),
});

const AgreePage = ({ f7route, f7router }: PageRouteProps) => {
  const initialValues: FormValues = {
    tos: false,
    privacy: false,
    location: false,
    sms: false,
    age: false,
  };

  const formikRef = useRef();
  const [sheetOpened, setSheetOpened] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [currentTerm, setCurrentTerm] = useState<Term>({} as Term);
  const { data: terms, isSuccess } = useQuery<Objects<Term>>('terms', getObjects({ model_name: 'term' }));

  const openTermSheet = async (title) => {
    await setCurrentTerm(terms.objects.find((term) => term.title === title));
    await setSheetOpened(true);
  };

  useEffect(() => {
    if (isSuccess) {
      setCurrentTerm(terms.objects[0]);
    }
  }, [isSuccess]);

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
        <div
          className="p-5 overflow-sroll h-full whitespace-pre-wrap w-100"
          dangerouslySetInnerHTML={{ __html: currentTerm?.content }}
        />
      </Sheet>

      <div className="p-4">
        <div className="text-font-bold text-2xl mt-2">약관 동의를 해주실래요?</div>
        <div className="mt-5 mb-2 text-font-bold flex justify-between">
          전체동의
          <img
            src={agreeAll ? selectCircle : unselectCircle}
            alt=""
            className="w-7 h-7"
            onClick={() => onClickAgreeAll()}
          />
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
          // enableReinitialize
        >
          {({ handleChange, handleBlur, setFieldValue, values, errors, touched, isSubmitting, isValid }) => (
            <Form>
              <div className="flex justify-between my-2">
                <a
                  href=""
                  onClick={() => openTermSheet('집마켓 이용약관 안내')}
                  className="underline link text-theme-gray"
                >
                  (필수) 집마켓 이용약관 안내
                </a>
                <label htmlFor="tos">
                  <img src={values.tos ? selectCircle : unselectCircle} alt="" className="w-7 h-7" />
                </label>
                <input
                  type="checkbox"
                  name="tos"
                  id="tos"
                  onChange={(e) => {
                    onClickAgree('tos', e.target.checked);
                  }}
                  onBlur={handleBlur}
                  checked={values.tos}
                  className="hidden"
                />
              </div>
              <div className="flex justify-between my-2">
                <a
                  href=""
                  onClick={() => openTermSheet('개인정보수집 및 이용동의')}
                  className="underline link text-theme-gray"
                >
                  (필수) 개인정보수집 및 이용동의
                </a>
                <label htmlFor="privacy">
                  <img src={values.privacy ? selectCircle : unselectCircle} alt="" className="w-7 h-7" />
                </label>
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
                <a
                  href=""
                  onClick={() => openTermSheet('위치기반서비스 이용약관')}
                  className="underline link text-theme-gray"
                >
                  (필수) 위치기반서비스 이용약관
                </a>
                <label htmlFor="location">
                  <img src={values.location ? selectCircle : unselectCircle} alt="" className="w-7 h-7" />
                </label>
                <input
                  type="checkbox"
                  name="location"
                  id="location"
                  onChange={(e) => {
                    onClickAgree('location', e.target.checked);
                  }}
                  onBlur={handleBlur}
                  checked={values.location}
                  className="hidden"
                />
              </div>
              <div className="flex justify-between my-2">
                <a
                  href=""
                  onClick={() => openTermSheet('마케팅 목적 개인정보수집 및 이용동의')}
                  className="underline link text-theme-gray"
                >
                  (선택) 마케팅 목적 개인정보수집 및 이용동의
                </a>
                <label htmlFor="sms">
                  <img src={values.sms ? selectCircle : unselectCircle} alt="" className="w-7 h-7" />
                </label>
                <input
                  type="checkbox"
                  name="sms"
                  id="sms"
                  onChange={(e) => {
                    onClickAgree('sms', e.target.checked);
                  }}
                  onBlur={handleBlur}
                  checked={values.sms}
                  className="hidden"
                />
              </div>
              <div className="flex justify-between my-2">
                <a href="" className="underline link text-theme-gray">
                  (안내) 만 14세 이상만 가입 가능합니다.
                </a>
                <label htmlFor="age">
                  <img src={values.age ? selectCircle : unselectCircle} alt="" className="w-7 h-7" />
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
