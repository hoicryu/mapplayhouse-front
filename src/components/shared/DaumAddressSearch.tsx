import React, { useState, useRef } from 'react';
import { f7, List, Row, Col, ListInput } from 'framework7-react';
import DaumPostcode from 'react-daum-postcode';
import { useFormikContext } from 'formik';
import { Address } from '@constants';

const DaumAddressSearch = ({ textTheme = 'text-theme-black' }: { textTheme?: string }) => {
  const {
    values: { zipcode, address1, address2 },
    touched,
    errors,
    setFieldValue,
    handleChange,
    handleBlur,
  } = useFormikContext<Address>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const $address2Input = useRef(null);
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setFieldValue('zipcode', data.zonecode);
    setFieldValue('address1', fullAddress);
    setIsOpen(false);
    $address2Input.current.focus();
  };

  const inputStyle = (textRight = true) => {
    const style = {
      width: '100%',
      border: '1px solid #E8EBF2',
      borderRadius: '0.5rem',
      padding: '0.3rem 0.6rem',
      fontSize: '0.8rem',
      color: '#191919',
      textAlign: 'right',
    };
    if (!textRight) {
      style.textAlign = 'left';
    }
    return style as React.CSSProperties;
  };

  return (
    <>
      <Row className="items-center pt-3">
        <Col width="25" className={textTheme}>
          주소지
        </Col>
        <Col width="35">
          <input
            type="text"
            name="zipcode"
            autoComplete="off"
            onChange={handleChange}
            onBlur={handleBlur}
            value={zipcode}
            readOnly
            className="mt-1"
            style={inputStyle(false)}
          />
        </Col>
        <Col width="5" />
        <Col width="35">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="text-font-bold button button-fill text-xs text-theme-black bg-theme-gray-light rounded-full"
          >
            우편번호 찾기
          </button>
        </Col>
      </Row>
      <Row className="items-center pt-3">
        <Col width="25" />
        <Col width="75">
          <input
            type="text"
            name="address1"
            autoComplete="off"
            onChange={handleChange}
            onBlur={handleBlur}
            value={address1}
            readOnly
            className="mt-1"
            style={inputStyle(false)}
          />
        </Col>
      </Row>
      <Row className="items-center pt-3">
        <Col width="25" className={textTheme}>
          상세주소
        </Col>
        <Col width="75">
          <input
            type="text"
            name="address2"
            ref={() => ($address2Input.current = f7.$el.find('input[name=address2]'))}
            autoComplete="off"
            onChange={handleChange}
            onBlur={handleBlur}
            value={address2}
            className="mt-1"
            style={inputStyle(false)}
          />
        </Col>
      </Row>

      {isOpen && <DaumPostcode onComplete={handleComplete} />}
    </>
  );
};

export default React.memo(DaumAddressSearch);
