import React, { useState, useRef, useEffect, useCallback } from 'react';
import { f7, Row, Col } from 'framework7-react';
import { getSmsAuth } from '@api';
import { useField } from 'formik';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import { useRecoilState } from 'recoil';
import { customToastState } from '@atoms';
import { RiContactsBookLine } from 'react-icons/ri';

interface PhoneCertificationProps {
  setConfirmed: any;
  signup?: boolean;
  regisEdit?: boolean;
}

const PhoneCertification = ({ setConfirmed, signup = false, regisEdit }: PhoneCertificationProps) => {
  const [code, setCode] = useState<string>('');
  const [certComplete, setCertComplete] = useState<boolean>(false);
  const [sended, setSended] = useState<boolean>(false);
  const [timeLeftOn, setTimeLeftOn] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>('3:00');
  const [codeErrorMessage, setCodeErrorMessage] = useState<string>('');
  const [phoneEdit, setPhoneEdit] = useState<boolean>(!regisEdit);
  const [openCustomToast, setOpenCustomToast] = useRecoilState(customToastState);
  const $phoneInput = useRef(null);
  const $codeInput = useRef(null);
  const timeLeftInterval = useRef(null);

  const [field, meta, helper] = useField({ name: 'phone' });

  const removeFormValueHandler = useCallback(() => helper.setValue(meta.initialValue), []);

  useEffect(() => {
    window.addEventListener('removePhoneFormValue', removeFormValueHandler);
    return () => {
      window.removeEventListener('removePhoneFormValue', removeFormValueHandler);
    };
  }, []);

  const onChangeCode = (e) => e.target.value.length < 7 && setCode(e.target.value);

  const calcLeftTime = () => {
    if (timeLeftOn) clearInterval(timeLeftInterval.current);
    setTimeLeftOn(true);
    setTimeLeft('3:00');
    let maxTime: number = 180; // 3 minutes
    let min;
    let sec;
    timeLeftInterval.current = setInterval(() => {
      min = Math.floor(maxTime / 60);
      sec = maxTime % 60;
      setTimeLeft(`${min}:${sec >= 10 ? sec : `0${sec}`}`);
      maxTime -= 1;
      if (maxTime < 0) {
        clearInterval(timeLeftInterval.current);
        setTimeLeft('00:00');
        setCodeErrorMessage('인증시간이 초과되었습니다');
      }
    }, 1000);
  };

  const onClickSendPhoneCert = async () => {
    let phone = field.value;
    if (phone === '') {
      setOpenCustomToast({ ...openCustomToast, content: '휴대폰 번호를 입력해주세요.', open: true });
      $phoneInput.current.focus();
    } else if (phone.length < 10 || phone.length > 13) {
      setOpenCustomToast({ ...openCustomToast, content: '휴대폰 번호가 올바르지 않습니다', open: true });
      $phoneInput.current.focus();
    } else {
      if (phone.includes('-')) {
        phone = phone.replaceAll('-', '');
        helper.setValue(phone);
      }
      f7.dialog.preloader('잠시만 기다려주세요...');

      try {
        const { success } = (await getSmsAuth({ phone })).data;
        if (success) {
          setSended(true);
          setOpenCustomToast({ ...openCustomToast, content: '인증번호가 발송되었습니다.', open: true });
          f7.dialog.close();
          $codeInput.current.focus();
          calcLeftTime();
        } else {
          setOpenCustomToast({ ...openCustomToast, content: '인증번호 발송이 불가능한 번호입니다', open: true });
        }
        f7.dialog.close();
      } catch (err) {
        setOpenCustomToast({
          ...openCustomToast,
          content: `${err.response.status} ${err.response.statusText}`,
          open: true,
        });
        f7.dialog.close();
      }
    }
  };

  const onClickCert = async () => {
    if (code === '') {
      setOpenCustomToast({ ...openCustomToast, content: '인증번호를 입력해주세요', open: true });
    } else {
      f7.dialog.preloader('잠시만 기다려주세요...');

      try {
        const { success, message, user_exists } = (
          await getSmsAuth({
            phone: field.value,
            code,
            signup,
          })
        ).data;
        if (success) {
          clearInterval(timeLeftInterval.current);
          setCertComplete(true);
          setCodeErrorMessage('');
          if (setConfirmed) setConfirmed(true);
        } else if (user_exists) {
          setCodeErrorMessage('이미 가입된 계정이 있어요 :(');
        } else {
          $codeInput.current.focus();
          if (timeLeft !== '00:00') setCodeErrorMessage('올바른 인증번호를 입력해주세요');
        }

        setOpenCustomToast({ ...openCustomToast, content: message, open: true });
        f7.dialog.close();
      } catch (err) {
        if (err.response) {
          setOpenCustomToast({
            ...openCustomToast,
            content: `${err.response.status} ${err.response.statusText}`,
            open: true,
          });
        }
        f7.dialog.close();
      }
    }
  };

  useEffect(() => {
    if (sended && code.length === 6) {
      onClickCert();
    }
  }, [code]);

  return (
    <>
      <div className="mt-3">
        <label htmlFor="phone" className="text-font-bold">
          휴대폰 번호
        </label>
        <Row className="items-center mt-1">
          <Col width="75">
            <input
              type="text"
              name="phone"
              id="phone"
              className="w-full"
              placeholder="휴대폰번호를 입력해주세요"
              autoComplete="off"
              ref={() => ($phoneInput.current = f7.$el.find('input[name=phone]'))}
              onChange={field.onChange}
              value={field.value}
              readOnly={certComplete || !phoneEdit}
              style={{
                backgroundColor: !phoneEdit ? '#E8EBF2' : 'white',
                border: '1px solid #E8EBF2',
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                borderRadius: '7px',
              }}
            />
            {meta.touched && meta.error && <p className="text-xs text-theme-orange">{meta.touched && meta.error}</p>}
          </Col>
          <Col width="25" className="">
            <button
              onClick={async () => {
                if (!phoneEdit) {
                  await helper.setValue(meta.initialValue);
                  await setPhoneEdit(true);
                } else {
                  setCodeErrorMessage('');
                  onClickSendPhoneCert();
                  setCertComplete(false);
                }
              }}
              type="button"
              id="cert-button"
              className="text-font-bold px-2 button button-fill text-xs text-theme-black bg-theme-gray-light disabled:opacity-50 rounded-full"
            >
              {!phoneEdit ? '변경' : <> {sended ? '재발송' : '인증요청'} </>}
            </button>
          </Col>
        </Row>
      </div>
      <div className="mt-3">
        <label htmlFor="code" className="text-font-bold">
          인증번호
        </label>
        <Input
          ref={() => ($codeInput.current = f7.$el.find('input[name=code]'))}
          type="text"
          name="code"
          id="code"
          autoComplete="off"
          placeholder="인증번호입력"
          onChange={onChangeCode}
          value={code}
          readOnly={certComplete}
          className="w-full mt-1"
          style={{
            backgroundColor: certComplete ? '#E8EBF2' : 'white',
            border: '1px solid #E8EBF2',
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            borderRadius: '7px',
            marginTop: '0.25rem',
          }}
          endAdornment={
            <InputAdornment position="end">
              {sended && !certComplete && (
                <>
                  <span className="text-font-bold">{timeLeft}</span>
                </>
              )}
            </InputAdornment>
          }
        />
        {codeErrorMessage !== '' && (
          <div className="mt-1">
            <p className="text-xs text-theme-orange">{codeErrorMessage}</p>
          </div>
        )}
      </div>
      <p className="mt-1 pl-4 pb-2 text-theme-blue">{sended && certComplete && '인증완료:O'}</p>
    </>
  );
};

export default React.memo(PhoneCertification);
