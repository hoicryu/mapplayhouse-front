import React, { useEffect, useRef, useState } from 'react';
import { f7, Navbar, Page, Row, Col } from 'framework7-react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import useAuth from '@hooks/useAuth';
import { sleep } from '@utils';
import { userEditAPI } from '@api';
import { useMutation } from 'react-query';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import { PageRouteProps } from '@constants';
import PhoneCertification from '@components/shared/PhoneCertification';
import SheetAlert from '@components/shared/SheetAlert';
import { useRecoilState } from 'recoil';
import { customToastState } from '@atoms';

interface FormValues {
  name: string;
  password?: string;
  phone: string;
}

const UserEditPage = ({ f7router }: PageRouteProps) => {
  const { currentUser, isAuthenticated, authenticateUser } = useAuth();
  const formikRef = useRef(null);
  const [passwordEdit, setPasswordEdit] = useState<boolean>(false);
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [certComplete, setCertComplete] = useState<boolean>(false);
  const [alertSheetOpened, setAlertSheetOpened] = useState<boolean>(false);
  const [openCustomToast, setOpenCustomToast] = useRecoilState(customToastState);

  const UserEditSchema = currentUser.provider
    ? Yup.object().shape({
        name: Yup.string().required('필수 입력사항 입니다'),
        phone: Yup.string()
          .min(9, '길이가 너무 짧습니다.')
          .max(15, '길이가 너무 깁니다.')
          .required('휴대폰 번호를 인증해주세요.'),
      })
    : Yup.object().shape({
        name: Yup.string().required('필수 입력사항 입니다'),
        password: Yup.string()
          .min(6, '6자 이상으로 작성해주세요')
          .max(16, '16자 이하로 작성해주세요')
          // .required('필수 입력사항 입니다')
          .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{6,16}$/,
            '영문, 숫자, 특수문자가 포함되어야 합니다',
          ),
        phone: Yup.string().min(9, '길이가 너무 짧습니다.').max(15, '길이가 너무 깁니다.'),
        // .required('휴대폰 번호를 인증해주세요.'),
      });

  const initialValues: FormValues = currentUser.provider
    ? {
        name: currentUser.name,
        phone: currentUser.phone.replaceAll('-', '') || '',
      }
    : {
        name: currentUser.name,
        password: '',
        phone: currentUser.phone.replaceAll('-', '') || '',
      };

  const updateMutation = useMutation(userEditAPI(currentUser.id), {
    onError: (error) => {
      console.log(error);
      f7.dialog.close();
      setAlertSheetOpened(true);
      // f7.dialog.alert(error?.response?.data || error?.message);
    },
  });

  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.setValues({
        name: currentUser.name,
      });
    }
  }, []);

  return (
    <Page noToolbar>
      <Navbar title="회원정보수정" backLink noHairline innerClassName="bg-white" />
      <SheetAlert
        sheetOpened={alertSheetOpened}
        setSheetOpened={setAlertSheetOpened}
        content="에러가 발생했습니다."
        btnText="확인"
      />
      {isAuthenticated && (
        <Formik
          initialValues={initialValues}
          validationSchema={UserEditSchema}
          innerRef={formikRef}
          onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
            await sleep(400);
            setSubmitting(false);
            f7.dialog.preloader('잠시만 기다려주세요...');
            updateMutation.mutate(
              { user: values },
              {
                onSuccess: async (res) => {
                  const { result, token, csrf } = res;
                  if (result) {
                    authenticateUser({ token, csrf });
                    f7.dialog.close();
                    setOpenCustomToast({
                      ...openCustomToast,
                      content: '성공적으로 회원 정보가 수정되었습니다.',
                      open: true,
                    });
                    f7router.back();
                  } else {
                    f7.dialog.close();
                    setOpenCustomToast({
                      ...openCustomToast,
                      content: '입력한 정보를 확인해주세요.',
                      open: true,
                    });
                  }
                },
                onSettled: () => {
                  setSubmitting(false);
                },
              },
            );
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
                    style={{
                      width: '100%',
                      border: `${touched.name && errors.name ? '1px solid #FF9920' : '1px solid #E8EBF2'}`,
                      marginTop: '0.25rem',
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
                {!currentUser.provider && (
                  <>
                    <div className="my-3">
                      <label htmlFor="password" className="text-font-bold text-theme-black text-sm">
                        새로운 비밀번호
                      </label>
                      <Row className="items-center mt-1">
                        <Col width="75">
                          <Input
                            type={passwordShow ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="영문, 숫자, 특수문자 포함 6자 이상"
                            autoComplete="off"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            readOnly={!passwordEdit}
                            className={`${!passwordEdit && 'bg-theme-gray-light'}`}
                            style={{
                              width: '100%',
                              border: `${
                                touched.password && errors.password ? '1px solid #FF9920' : '1px solid #E8EBF2'
                              }`,
                              borderRadius: '0.5rem',
                              padding: '0.6rem',
                              fontSize: '0.8rem',
                              color: '#191919',
                            }}
                            endAdornment={
                              passwordEdit && (
                                <InputAdornment position="end">
                                  <div onClick={() => setPasswordShow((val) => !val)}>
                                    {passwordShow ? (
                                      <img src={showPassword} alt="" className="w-8 h-8" />
                                    ) : (
                                      <img src={notShowPassword} alt="" className="w-8 h-8" />
                                    )}
                                  </div>
                                </InputAdornment>
                              )
                            }
                          />
                        </Col>
                        <Col width="25">
                          <button
                            onClick={() => setPasswordEdit(true)}
                            type="button"
                            id="cert-button"
                            className="text-font-bold px-2 button button-fill text-xs text-theme-black bg-theme-gray-light rounded-full"
                            disabled={passwordEdit}
                          >
                            {passwordEdit ? '변경중' : '변경'}
                          </button>
                        </Col>
                      </Row>
                      {touched.password && errors.password && (
                        <div className="mt-1">
                          <p className="text-xs text-theme-orange">{errors.password}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
                <PhoneCertification setConfirmed={setCertComplete} regisEdit />
                <div className="pt-4">
                  <button
                    type="submit"
                    className="button button-fill button-large bg-theme-blue rounded-full disabled:opacity-50 text-font-bold"
                    disabled={isSubmitting || !isValid || (!certComplete && !values.password)}
                  >
                    변경완료
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Page>
  );
};

export default React.memo(UserEditPage);
