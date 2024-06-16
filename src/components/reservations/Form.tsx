import React from 'react';
import * as Yup from 'yup';
import { f7, ListInput } from 'framework7-react';
import { Formik, Form, FormikHelpers } from 'formik';
import { createReservation } from '@api';
import { useMutation, useQueryClient } from 'react-query';
import { customToastState } from '@atoms';
import useAuth from '@hooks/useAuth';
import { useRecoilState } from 'recoil';

interface ReservationFormValue {
  times: string[];
  num_of_people: number;
  note: string;
}

const ReservationForm = ({ f7router, selectedTime }) => {
  const ApplicationFormsSchema = Yup.object().shape({
    num_of_people: Yup.number().min(5, '최소 5명이상 일때 예약이 가능합니다.'),
    note: Yup.string().required('필수 입력사항입니다'),
  });

  const createReservationMutation = useMutation(createReservation());

  const queryClient = useQueryClient();
  const [openCustomToast, setOpenCustomToast] = useRecoilState(customToastState);
  const { currentUser, isAuthenticated, authenticateUser } = useAuth();

  const initialValues: ReservationFormValue = {
    times: selectedTime || [],
    num_of_people: 0,
    note: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ApplicationFormsSchema}
      onSubmit={async (values, { setSubmitting }: FormikHelpers<ReservationFormValue>) => {
        f7.dialog.preloader('잠시만 기다려주세요...');
        setSubmitting(true);
        createReservationMutation.mutate(
          { reservation: values },
          {
            onSuccess: () => {
              f7.dialog.close();
              queryClient.invalidateQueries('reservations');
              f7router.back();
              setOpenCustomToast({
                ...openCustomToast,
                content: `성공적으로 신청되었습니다.`,
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
              label="생년월일"
              name="num_of_people"
              type="number"
              placeholder="인원수를 입력해주세요."
              value={values.num_of_people}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessageForce
              errorMessage={touched.num_of_people && errors.num_of_people}
              clearButton
            />
            <ListInput
              label="내용"
              name="note"
              type="text"
              placeholder="연습내용을 입력해주세요."
              value={values.note}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessageForce
              errorMessage={touched.note && errors.note}
              clearButton
            />
          </ul>

          <div className="p-5">
            <button
              type="submit"
              className="button button-fill button-large disabled:opacity-50 text-font-bold"
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
