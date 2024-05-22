import React, { useRef } from 'react';
import * as Yup from 'yup';
import { f7, List, ListInput } from 'framework7-react';
import { Formik, Form, FormikHelpers, FormikProps, FormikValues, Field, FieldArray } from 'formik';
import { createObject, updateObject } from '@api';
import { useMutation, useQueryClient } from 'react-query';
import { customToastState } from '@atoms';
import useAuth from '@hooks/useAuth';
import { useRecoilState } from 'recoil';
import { Part } from '@constants';

interface ApplicationFormValue {
  name: string;
  birthday: string;
  phone: string;
  selectedParts: number[];
  // signature: string;
}

const ApplicationFormsSchema = Yup.object().shape({
  name: Yup.string().required('필수 입력사항입니다'),
  birthday: Yup.string().required('필수 입력사항입니다').min(6, '6글자 이상 입력해주셔야합니다'),
  phone: Yup.string().required('필수 입력사항입니다'),
  selectedParts: Yup.array().min(1, '최소 1개 이상 선택해야 합니다'),
  // signature: Yup.string().required('필수 입력사항입니다'),
});

const ApplicationForm = ({ application_form = null, f7router, group }) => {
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
    selectedParts: application_form?.selectedParts || [],
    // signature: application_form?.signature || '',
  };

  const sortPartsByRating = (parts) => {
    const sortedParts = parts?.sort((a, b) => {
      if (a.rating.status === 'main') {
        if (a.rating.status === b.rating.status) {
          if (a.title > b.title) return 1;
          if (a.title < b.title) return -1;
        }
        return -1;
      }
      if (a.rating.status === 'supporting') {
        if (b.rating.status === 'main') return 1;
        if (a.rating.status === b.rating.status) {
          if (a.title > b.title) return 1;
          if (a.title < b.title) return -1;
        }
        return -1;
      }
      if (a.rating.status === 'ensemble') {
        if (a.rating.status === b.rating.status) {
          if (a.title > b.title) return 1;
          if (a.title < b.title) return -1;
        }
        if (b.rating.status === 'main' || b.rating.status === 'supporting') return 1;
        return -1;
      }
    });
    return sortedParts;
  };

  const partsData = [...group.musical.parts];
  return (
    <>
      <List noHairlinesMd>
        <Formik
          initialValues={initialValues}
          validationSchema={ApplicationFormsSchema}
          onSubmit={async (values, { setSubmitting }: FormikHelpers<ApplicationFormValue>) => {
            console.log(values, '???');
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
                <li>
                  <div className="item-content item-input">
                    <div className="item-inner">
                      <div className="item-title item-label">지원배역</div>
                      <FieldArray
                        name="selectedParts"
                        render={(arrayHelpers) => (
                          <div>
                            {sortPartsByRating(partsData).map((part: Part, idx: number) => (
                              <div
                                className={`flex items-center apply-parts ${idx > 0 ? 'mt-1.5' : 'mt-2.5'}`}
                                key={`part-box-${part.id}`}
                              >
                                <input
                                  name="selectedParts"
                                  type="checkbox"
                                  value={part.id}
                                  checked={values.selectedParts.includes(part.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) arrayHelpers.push(part.id);
                                    else {
                                      const idx = values.selectedParts.indexOf(part.id);
                                      arrayHelpers.remove(idx);
                                    }
                                  }}
                                />
                                <label className="ml-2 text-sm" htmlFor={`parts-${part.id}`}>
                                  {part.title}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </li>
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
