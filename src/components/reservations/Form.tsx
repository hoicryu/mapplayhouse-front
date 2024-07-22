import React, { useState } from 'react';
import * as Yup from 'yup';
import { f7, List, ListInput } from 'framework7-react';
import { Formik, Form, FormikHelpers } from 'formik';
import { createReservation, getUserGroups } from '@api';
import { useMutation, useQuery } from 'react-query';
import { customToastState, selectedDateState } from '@atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { dateFormat } from '@js/utils';

interface ReservationFormValue {
  start_at: string;
  end_at: string;
  num_of_people: number;
  note: string;
  group_id: string;
}

const ReservationForm = ({ f7router, startTime, endTime }) => {
  const ApplicationFormsSchema = Yup.object().shape({
    num_of_people: Yup.number().min(5, '최소 5명이상 일때 예약이 가능합니다.'),
    note: Yup.string().required('필수 입력사항입니다'),
    group_id: Yup.string().required('작품 진행중인 분만 예약이 가능합니다.'),
  });

  const createReservationMutation = useMutation(createReservation());
  const [openCustomToast, setOpenCustomToast] = useRecoilState(customToastState);
  const selectedDate = useRecoilValue(selectedDateState);

  const [initialValues, setInitialValues] = useState<ReservationFormValue>({
    start_at: startTime || '',
    end_at: endTime || '',
    num_of_people: 0,
    note: '',
    group_id: '',
  });

  const { data: userGroups } = useQuery('user_groups', getUserGroups(), {
    onSuccess: (res) => {
      if (res.length > 0) {
        setInitialValues((prevValues) => ({
          ...prevValues,
          group_id: res[0].group.id,
        }));
      }
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ApplicationFormsSchema}
      onSubmit={async (values, { setSubmitting }: FormikHelpers<ReservationFormValue>) => {
        f7.dialog.preloader('잠시만 기다려주세요...');
        setSubmitting(true);
        values['start_at'] = `${selectedDate} ${values['start_at']}`;
        values['end_at'] = `${selectedDate} ${values['end_at']}`;
        createReservationMutation.mutate(
          { reservation: values },
          {
            onSuccess: async (res) => {
              console.log(res);
              f7.dialog.close();
              if (res && typeof res === 'object' && 'start_at' in res) {
                f7.views.get('#view-reservations').router.navigate('/reservations', {
                  reloadCurrent: true,
                  ignoreCache: true,
                  props: {
                    date: dateFormat(new Date(res.start_at), 'day'),
                  },
                });
                setOpenCustomToast({
                  ...openCustomToast,
                  content: `성공적으로 신청되었습니다.`,
                  open: true,
                });
              } else if (typeof res === 'string' && res === 'group_id_empty') {
                setOpenCustomToast({
                  ...openCustomToast,
                  content: `현재 진행중인 작품이 있는 유저만 신청이 가능합니다.`,
                  open: true,
                });
              } else {
                setOpenCustomToast({
                  ...openCustomToast,
                  content: `예약이 불가한 시간입니다.`,
                  open: true,
                });
              }
            },
          },
        );
      }}
      enableReinitialize
      validateOnMount
    >
      {({ values, isSubmitting, isValid, handleChange, handleBlur, touched, errors }) => (
        <Form className="reservation-form">
          <List noHairlinesMd>
            <ul>
              <ListInput
                label="그룹"
                name="group_id"
                type="select"
                value={values.group_id}
                onChange={handleChange}
                onBlur={handleBlur}
                errorMessageForce
                errorMessage={touched.group_id && errors.group_id}
              >
                {userGroups &&
                  userGroups.map((userGroup) => (
                    <option key={`userGroup-${userGroup.id}`} value={userGroup.group.id}>
                      {`${userGroup.group.title} ${userGroup.group.musical.title}`}
                    </option>
                  ))}
              </ListInput>
              <ListInput
                className="number-type-input"
                label="인원수"
                name="num_of_people"
                type="number"
                placeholder="인원수를 입력해주세요."
                value={values.num_of_people}
                onChange={handleChange}
                onBlur={handleBlur}
                errorMessageForce
                errorMessage={touched.num_of_people && errors.num_of_people}
              />
              <ListInput
                label="연습내용"
                name="note"
                type="textarea"
                placeholder="연습내용을 입력해주세요."
                value={values.note}
                onChange={handleChange}
                onBlur={handleBlur}
                errorMessageForce
                errorMessage={touched.note && errors.note}
                clearButton
              />
              <li className="px-4 flex text-xs py-3 text-gray-500">
                <span className="mt-0.5">*</span>
                <div className="ml-1 flex flex-col">
                  <span className="">신청 후 관리자 승인이 필요합니다.</span>
                  <span>관리자 승인시 예약이 확정됩니다.</span>
                  <span>예약 신청 승인 여부는 마이페이지에서 확인가능합니다.</span>
                </div>
              </li>
            </ul>
          </List>

          <div className="p-5">
            <button
              type="submit"
              className="button button-fill button-large bg-theme-blue disabled:opacity-50 text-font-bold"
              disabled={isSubmitting || !isValid}
            >
              신청하기
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(ReservationForm);
