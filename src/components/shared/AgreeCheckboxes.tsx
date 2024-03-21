import React from 'react';
import { List, ListItem, Row, Col } from 'framework7-react';
import { useFormikContext } from 'formik';
import { map } from 'lodash';

interface AgreeCheckBoxProps {
  names: string[];
}

const AgreeCheckboxes = ({ names }: AgreeCheckBoxProps) => {
  const { values, handleChange, setFieldValue, validateField } = useFormikContext();

  const onClickAgreeAll = () => {
    map(names, (name) => {
      setFieldValue(name, true);
      validateField(name);
    });
  };

  return (
    <div className="pb-12 p-4 mt-10 bg-white">
      <div className="text-right mt-5 mb-5">
        <a onClick={onClickAgreeAll} className="text-theme-orange red">
          전체 동의
        </a>
      </div>
      {map(names, (name, index) => (
        <div key={index}>
          <Row noGap>
            <Col width="80">
              <List className="m-0">
                <ListItem
                  checkbox
                  className="text-xs"
                  title={i18next.t('checkdesc')[name]}
                  name={name}
                  onChange={handleChange}
                  value={values[name]}
                  checked={values[name]}
                />
              </List>
            </Col>
            <Col width="20" className="text-right mt-2">
              <label className="item-checkbox">
                <a className="text-base underline link" href="#">
                  보기
                </a>
              </label>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
};

export default React.memo(AgreeCheckboxes);
