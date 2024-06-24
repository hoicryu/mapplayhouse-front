import React from 'react';
import * as Yup from 'yup';
import { f7, List, ListInput } from 'framework7-react';
import { Formik, Form, FormikHelpers } from 'formik';
import { createReservation } from '@api';
import { useMutation, useQueryClient } from 'react-query';
import { customToastState, selectedDateState } from '@atoms';
import useAuth from '@hooks/useAuth';
import { useRecoilState, useRecoilValue } from 'recoil';

interface ReservationFormValue {
  start_at: string;
  end_at: string;
  num_of_people: number;
  note: string;
}

const ReservationForm = ({ f7router, startTime, endTime }) => {
  const ApplicationFormsSchema = Yup.object().shape({
    num_of_people: Yup.number().min(5, '최소 5명이상 일때 예약이 가능합니다.'),
    note: Yup.string().required('필수 입력사항입니다'),
  });

  const createReservationMutation = useMutation(createReservation());
  const queryClient = useQueryClient();
  const [openCustomToast, setOpenCustomToast] = useRecoilState(customToastState);
  const selectedDate = useRecoilValue(selectedDateState);
  const { currentUser, isAuthenticated, authenticateUser } = useAuth();

  const initialValues: ReservationFormValue = {
    start_at: startTime || '',
    end_at: endTime || '',
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
        values['start_at'] = `${selectedDate} ${values['start_at']}`;
        values['end_at'] = `${selectedDate} ${values['end_at']}`;
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
          <List noHairlinesMd>
            <ul>
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
