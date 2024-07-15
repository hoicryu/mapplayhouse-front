import React, { useEffect, useRef } from 'react';
import { f7, Navbar, Page } from 'framework7-react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import useAuth from '@hooks/useAuth';
import { sleep } from '@utils';
import { userEditAPI, IMAGE_API_URL } from '@api';
import { useMutation } from 'react-query';
import { PageRouteProps } from '@constants';
import { useRecoilState } from 'recoil';
import { customToastState } from '@atoms';
import { FaUserCircle } from 'react-icons/fa';
import editImg from '@assets/icons/edit.png';

interface FormValues {
  name: string;
  password?: string;
  phone: string;
}

const UserEditPage = ({ f7router }: PageRouteProps) => {
  const { currentUser, isAuthenticated, authenticateUser } = useAuth();
  const formikRef = useRef(null);
  const [openCustomToast, setOpenCustomToast] = useRecoilState(customToastState);

  const UserEditSchema = Yup.object().shape({
    name: Yup.string().required('필수 입력사항 입니다'),
    phone: Yup.string()
      .min(9, '길이가 너무 짧습니다.')
      .max(15, '길이가 너무 깁니다.')
      .required('휴대폰 번호를 인증해주세요.'),
  });

  const initialValues: FormValues = {
    name: currentUser?.name || '',
    phone: currentUser?.phone?.replaceAll('-', '') || '',
  };

  const updateMutation = useMutation(userEditAPI(currentUser.id), {
    onError: (error) => {
      console.log(error);
      f7.dialog.close();
      setOpenCustomToast({
        ...openCustomToast,
        content: `회원정보가 올바르지 않습니다.`,
        open: true,
      });
    },
  });

  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.setValues({
        name: currentUser?.name || '',
        phone: currentUser?.phone || '',
      });
    }
  }, []);

  return (
    <Page noToolbar>
      <Navbar title="회원정보수정" backLink noHairline innerClassName="bg-white" />
      <div className="w-full mt-5 flex justify-center">
        <div className="relative">
          {currentUser.image_path ? (
            <img src={IMAGE_API_URL + currentUser.image_path} alt="" className="rounded-xl w-20 h-20" />
          ) : (
            <FaUserCircle style={{ fontSize: '80px', color: 'gray' }} />
          )}
          <div className="absolute right-0 bottom-0">
            <label htmlFor="change-user-profile" className="change-user-profile">
              <div className="rounded-full overflow-hidden shadow">
                <img src={editImg} alt="" className="p-1 w-5 h-5 bg-white" />
              </div>
            </label>
            <input
              type="file"
              id="change-user-profile"
              name="image"
              hidden
              onChange={(e) => {
                f7.dialog.preloader('잠시만 기다려주세요');
                const formData = new FormData();
                formData.append('user[image]', e.target.files[0]);
                updateMutation.mutate(formData, {
                  onSuccess: async (res) => {
                    f7.dialog.close();
                    const { token, csrf } = res;
                    authenticateUser({ token, csrf });
                    setOpenCustomToast({
                      ...openCustomToast,
                      content: `프로필 이미지가 변경되었습니다.`,
                      open: true,
                    });
                  },
                });
              }}
            />
          </div>
        </div>
      </div>
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
                <div className="my-3">
                  <label htmlFor="phone" className="text-font-bold text-theme-black text-sm">
                    휴대폰 번호
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="휴대폰 번호를 입력해주세요."
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                    style={{
                      width: '100%',
                      border: `${touched.phone && errors.phone ? '1px solid #FF9920' : '1px solid #E8EBF2'}`,
                      marginTop: '0.25rem',
                      borderRadius: '0.5rem',
                      padding: '0.6rem',
                      fontSize: '0.8rem',
                      color: '#191919',
                    }}
                  />
                  {touched.phone && errors.phone && (
                    <div className="mt-1">
                      <p className="text-xs text-theme-orange">{errors.phone}</p>
                    </div>
                  )}
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="button button-fill button-large bg-theme-blue disabled:opacity-50 text-font-bold"
                    disabled={isSubmitting || !isValid}
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
