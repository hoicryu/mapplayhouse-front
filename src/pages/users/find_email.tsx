import React, { useRef, useState } from 'react';
import { f7, Navbar, Page, Row, Col } from 'framework7-react';
import PhoneCertification from '@components/shared/PhoneCertification';
import { Form, Formik, FormikHelpers } from 'formik';
import { sleep } from '@utils';
import { getFindEmail } from '@api';
import i18next from 'i18next';
import { PageRouteProps } from '@constants';
import SheetAlert from '@components/shared/SheetAlert';

interface FormValues {
  phone: string;
}

const FindEmailPage = ({ f7route, f7router }: PageRouteProps) => {
  const initialValues: FormValues = { phone: '' };
  const [certComplete, setCertComplete] = useState<boolean>(false);
  const [findYes, setFindYes] = useState<boolean>(false);
  const [alertSheetOpened, setAlertSheetOpened] = useState<boolean>(false);
  const [alertSheetContent, setAlertSheetContent] = useState<string>('');
  const [findEmailResult, setFindEmailResult] = useState<{ email: string; provider: string }>({
    email: '',
    provider: null,
  });
  const formikRef = useRef<React.MutableRefObject<any>>();

  const resultHTML = () => {
    let result = '';
    if (findEmailResult.provider) {
      result = `${
        i18next.t('enum').provider[`${findEmailResult.provider}`] as string
      } 로그인을 사용중입니다.(비밀번호 없이 해당 수단으로 로그인 가능) 비밀번호를 분실하신 경우, 각 서비스에서 제공되는 비밀번호 찾기를 이용해주세요.`;
    } else if (findEmailResult.email) {
      const emailSplit = findEmailResult.email.split('@');
      const starLength = '*'.repeat(emailSplit[0].length > 3 ? 3 : emailSplit[0].length);
      result = `${emailSplit[0].substr(0, emailSplit[0].length - 3)}${starLength}@${emailSplit[1]}`;
    } else {
      result = '일치하는 이메일주소가 없습니다.';
    }
    return result;
  };

  const resultButton = () => (
    <>
      <Row className="p-6">
        <Col tag="span">
          <button
            onClick={() => {
              if (findEmailResult.email && !findEmailResult.provider) {
                f7router.navigate('/find_password');
              } else {
                setFindYes(false);
                setFindEmailResult({ email: '', provider: null });
                window.dispatchEvent(new CustomEvent('removePhoneFormValue'));
              }
            }}
            className="py-2 text-font-bold text-sm text-theme-black bg-white border-2 border-theme-gray-light rounded-full"
          >
            {findEmailResult.email && !findEmailResult.provider ? '비밀번호 찾기' : '이메일찾기'}
          </button>
        </Col>
        <Col tag="span">
          <button
            onClick={() => {
              f7router.back();
            }}
            className="py-2 text-font-bold text-sm text-theme-black bg-theme-gray-light rounded-full"
          >
            로그인
          </button>
        </Col>
      </Row>
      {findEmailResult.email && (
        <div className="text-theme-gray text-xs flex">
          <img src={warning} alt="" className="w-4 h-4 mr-1" />
          개인정보 보호를 위해 뒤에 3자리는 ***으로 표기하였습니다.
        </div>
      )}
    </>
  );

  return (
    <Page noToolbar>
      <Navbar title="이메일 찾기" backLink noHairline innerClassName="bg-white" />
      <SheetAlert
        sheetOpened={alertSheetOpened}
        setSheetOpened={setAlertSheetOpened}
        content={alertSheetContent}
        btnText="확인"
      />
      {findYes ? (
        <div className="p-6">
          <div className="text-theme-black text-font-bold">이메일주소</div>
          <div className="text-sm">{resultHTML()}</div>
          {resultButton()}
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          innerRef={formikRef}
          onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
            await sleep(400);
            setSubmitting(false);
            f7.dialog.preloader('잠시만 기다려주세요...');
            try {
              const data: { email: string; provider: string } = await getFindEmail(values);
              setFindEmailResult(data);
              setFindYes(true);
              f7.dialog.close();
            } catch (error) {
              f7.dialog.close();
              setAlertSheetContent(error?.response?.data || error?.message);
              setAlertSheetOpened(true);
            }
          }}
        >
          {({ values, isSubmitting, isValid }) => (
            <Form>
              <div className="p-6 text-font-bold text-2xl">이메일을 잊어버리셨나요?</div>
              <div className="px-6 text-theme-black">
                <PhoneCertification setConfirmed={setCertComplete} />
                <div className="pt-4">
                  <button
                    type="submit"
                    className="button button-fill button-large disabled:opacity-50 bg-theme-blue rounded-full text-font-bold"
                    disabled={isSubmitting || !isValid || !certComplete}
                  >
                    확인
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

export default React.memo(FindEmailPage);
