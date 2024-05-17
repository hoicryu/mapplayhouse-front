import React from 'react';
import * as Yup from 'yup';
import { f7, List, ListInput } from 'framework7-react';
import { Formik, Form, FormikHelpers } from 'formik';
import { createObject, updateObject } from '@api';
import { useMutation, useQueryClient } from 'react-query';
import { customToastState } from '@atoms';
import useAuth from '@hooks/useAuth';
import { useRecoilState } from 'recoil';

interface ApplicationFormValue {
  name: string;
  birthday: string;
  phone: string;
  part_ids: string[];
  signature: string;
}

const ApplicationFormsSchema = Yup.object().shape({
  name: Yup.string().required('필수 입력사항입니다'),
  birthday: Yup.string().required('필수 입력사항입니다').min(6, '6글자 이상 입력해주셔야합니다'),
  phone: Yup.string().required('필수 입력사항입니다'),
  part_ids: Yup.array(Yup.number()).required('필수 선택사항입니다'),
  signature: Yup.string().required('필수 입력사항입니다'),
});

const ApplicationForm = ({ application_form = null, f7router }) => {
  const { mutate } = !application_form
    ? useMutation(createObject({ model_name: 'application_form' }))
    : useMutation(updateObject(application_form.id, { model_name: 'application_form' }));
  const queryClient = useQueryClient();
  const [openCustomToast, setOpenCustomToast] = useRecoilState(customToastState);
  const { currentUser, isAuthenticated, authenticateUser } = useAuth();
  const initialValues: ApplicationFormValue = {
    name: currentUser.name || '',
    birthday: application_form?.birthday || '',
    phone: application_form?.phone || '',
    part_ids: application_form?.part_ids || '',
    signature: application_form?.signature || '',
  };

  return (
    <>
      <List noHairlinesMd>
        <Formik
          initialValues={initialValues}
          validationSchema={ApplicationFormsSchema}
          onSubmit={async (values, { setSubmitting }: FormikHelpers<ApplicationFormValue>) => {
            f7.dialog.preloader('잠시만 기다려주세요...');
            setSubmitting(true);
            mutate(
              { application_form: values },
              {
                onSuccess: () => {
                  f7.dialog.close();
                  queryClient.invalidateQueries('application_forms');
                  !!application_form && queryClient.invalidateQueries(['application_form', application_form.id]);
                  f7router.back();
                  setOpenCustomToast({
                    ...openCustomToast,
                    content: `성공적으로 ${!application_form ? '신청' : '수정'}되었습니다.`,
                    open: true,
                  });
                },
              },
            );
          }}
          enableReinitialize
          validateOnMount
        >
          {({ values, isSubmitting, isValid, handleChange, handleBlur, touched, errors }) => (
            <Form>
              <ul>
                <ListInput
                  label="성명(실명으로 작성 해 주세요)"
                  name="name"
                  type="text"
                  placeholder="내 답변"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessageForce
                  errorMessage={touched.name && errors.name}
                  clearButton
                />
                <ListInput
                  label="생년월일"
                  name="birthday"
                  type="text"
                  placeholder="내 답변"
                  value={values.birthday}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessageForce
                  errorMessage={touched.birthday && errors.birthday}
                  clearButton
                />
                <ListInput
                  label="연락처"
                  name="phone"
                  type="text"
                  placeholder="내 답변"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessageForce
                  errorMessage={touched.phone && errors.phone}
                  clearButton
                />
              </ul>

              <div className="p-5">
                <button
                  type="submit"
                  className="button button-fill button-large disabled:opacity-50 text-font-bold"
                  disabled={isSubmitting || !isValid}
                >
                  {!application_form ? '신청' : '수정'}하기
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </List>
    </>
  );
};

export default React.memo(ApplicationForm);
