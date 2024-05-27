import React, { useRef } from 'react';
import * as Yup from 'yup';
import { f7, List, ListInput } from 'framework7-react';
import { Formik, Form, FormikHelpers, FormikProps, FormikValues, Field, FieldArray } from 'formik';
import { createObject, updateObject } from '@api';
import { useMutation, useQueryClient } from 'react-query';
import { customToastState } from '@atoms';
import useAuth from '@hooks/useAuth';
import { useRecoilState } from 'recoil';
import { Part, Term } from '@constants';

interface ApplicationFormValue {
  name: string;
  birthday: string;
  phone: string;
  part_ids: number[];
  terms: { [key: string]: boolean };
  signature: string;
}

const ApplicationForm = ({ application_form = null, f7router, group, terms = [] }) => {
  const ApplicationFormsSchema = Yup.object().shape({
    name: Yup.string().required('필수 입력사항입니다'),
    birthday: Yup.string().required('필수 입력사항입니다').min(6, '6글자 이상 입력해주셔야합니다'),
    phone: Yup.string().required('필수 입력사항입니다'),
    part_ids: Yup.array().min(1, '최소 1개 이상 선택해야 합니다'),
    terms: Yup.object().shape(
      terms?.reduce((acc, term) => {
        acc[term.id] = Yup.boolean().oneOf([true], '모든 약관에 동의하셔야 합니다');
        return acc;
      }, {}),
    ),
    signature: Yup.string().required('필수 입력사항입니다'),
  });
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
    part_ids: application_form?.selectedParts || [],
    terms: terms?.reduce((acc, term) => {
      acc[term.id] = false;
      return acc;
    }, {}),
    signature: application_form?.signature || '',
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
    <List noHairlinesMd>
      <Formik
        initialValues={initialValues}
        validationSchema={ApplicationFormsSchema}
        onSubmit={async (values, { setSubmitting }: FormikHelpers<ApplicationFormValue>) => {
          f7.dialog.preloader('잠시만 기다려주세요...');
          setSubmitting(true);
          const copy = JSON.parse(JSON.stringify(values));
          copy.group_id = group.id;
          delete copy.terms;
          mutate(
            { application_form: copy },
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
                      name="part_ids"
                      render={(arrayHelpers) => (
                        <div>
                          {sortPartsByRating(partsData).map((part: Part, idx: number) => (
                            <div
                              className={`flex items-center apply-parts ${idx > 0 ? 'mt-1.5' : 'mt-2.5'}`}
                              key={`part-box-${part.id}`}
                            >
                              <input
                                id={`part-checkbox-${part.id}`}
                                name={`part-checkbox-${part.id}`}
                                type="checkbox"
                                value={part.id}
                                checked={values.part_ids.includes(part.id)}
                                onChange={(e) => {
                                  if (e.target.checked) arrayHelpers.push(part.id);
                                  else {
                                    const idx = values.part_ids.indexOf(part.id);
                                    arrayHelpers.remove(idx);
                                  }
                                }}
                              />
                              <label className="ml-2 text-sm" htmlFor={`part-checkbox-${part.id}`}>
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
              {terms &&
                terms.map((term: Term) => (
                  <li key={`term-box-${term.id}`}>
                    <div className="item-content item-input">
                      <div className="item-inner">
                        <div className="item-label">{term.content}</div>
                        {term.check_yes && (
                          <span className="mt-0.5" style={{ fontSize: '11px' }}>
                            확인하셨습니까?
                          </span>
                        )}
                        {term.sub_content && (
                          <span className="mt-0.5 text-gray-600" style={{ fontSize: '11px' }}>
                            {term.sub_content}
                          </span>
                        )}
                        <div className="flex items-center apply-parts mt-1.5">
                          <input
                            id={`term-yes-${term.id}`}
                            name={`terms[${term.id}]`}
                            type="radio"
                            value="yes"
                            checked={values.terms[term.id] === true}
                            onChange={() => {
                              handleChange({ target: { name: `terms[${term.id}]`, value: true } });
                            }}
                          />
                          <label className="ml-2 text-xs" htmlFor={`term-yes-${term.id}`}>
                            예
                          </label>
                          <input
                            id={`term-no-${term.id}`}
                            name={`term-no-${term.id}`}
                            type="radio"
                            value="no"
                            checked={values.terms[term.id] === false}
                            onChange={() => {
                              handleChange({ target: { name: `terms[${term.id}]`, value: false } });
                            }}
                            className="ml-5"
                          />
                          <label className="ml-1 text-xs" htmlFor={`term-no-${term.id}`}>
                            아니오
                          </label>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              <ListInput
                label="위 모든 내용을 확인하셨으며, 신청을 확정 하시겠습니까?"
                name="signature"
                type="text"
                placeholder="내 답변"
                value={values.signature}
                onChange={handleChange}
                onBlur={handleBlur}
                errorMessageForce
                errorMessage={touched.signature && errors.signature}
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
  );
};

export default React.memo(ApplicationForm);
