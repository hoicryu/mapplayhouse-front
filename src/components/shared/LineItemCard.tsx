/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useRef } from 'react';
import { f7, Row, Col, Button } from 'framework7-react';
import { currency } from '@js/utils';
import { API_URL, IMAGE_API_URL, deleteLineItem, changeLineItemQuantity, changeLineItemCheck, getObject } from '@api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { lineItemsSum } from '@atoms';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';
import { LineItem, MarketItem } from '@constants';
import minusWithCircle from '@assets/icons/minus_with_circle.png';
import plusWithCircle from '@assets/icons/plus_with_circle.png';

interface LineItemProps {
  line_item: LineItem;
  isCart?: boolean;
  stockPresent?: boolean;
}

interface QuantityValues {
  quantity: number;
}

const QuantitySchema = Yup.object().shape({
  quantity: Yup.number().required().positive().integer().min(1).max(100),
});

const LineItemCard = ({ line_item, isCart = false, stockPresent = true }: LineItemProps) => {
  const queryClient = useQueryClient();
  const setLineItemsSum = useSetRecoilState(lineItemsSum);
  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const { data: marketItem } = useQuery<MarketItem>(
    // `marketItem_${line_item.id}`,
    `lineItem_marketItem_${line_item.id}`,
    getObject(line_item.market_item_id, { model_name: 'market_item', status_eq: 'active' }),
  );

  const limitYes = (quantity) => marketItem.limit_yes && marketItem.limit_count && quantity >= marketItem.limit_count;

  const deleteMutation = useMutation(deleteLineItem(), {
    onSuccess: async (data) => {
      f7.preloader.show();
      await queryClient.invalidateQueries('line_items');
      await setLineItemsSum(() => data.line_items_sum);
      f7.preloader.hide();
    },
  });

  const changeQuantityMutation = useMutation(changeLineItemQuantity(line_item.id), {
    onSuccess: async () => {
      f7.preloader.show();
      await queryClient.invalidateQueries('line_items');
      f7.preloader.hide();
    },
  });

  const changeCheckMutation = useMutation(changeLineItemCheck(line_item.id), {
    onSuccess: async () => {
      f7.preloader.show();
      await queryClient.invalidateQueries('line_items');
      f7.preloader.hide();
    },
  });

  const onClickRemoveLineItem = (lineItemId) => deleteMutation.mutate(lineItemId);

  const onClickCheck = async () => {
    changeCheckMutation.mutate();
  };

  useEffect(() => {
    if (formikRef.current)
      formikRef.current.setValues({
        quantity: line_item.quantity || 1,
      });
  }, []);

  return (
    <Row className="py-3" noGap>
      {isCart && (
        <Col width="10">
          <img
            onClick={onClickCheck}
            src={line_item.is_checked ? selectCircle : unselectCircle}
            alt=""
            className="w-7 h-7"
          />
        </Col>
      )}
      <Col width="25" className="p-1">
        <a
          href={`/market_items/${line_item.market_item_id}`}
          className={!stockPresent ? 'cursor-default no-underline' : ''}
        >
          {marketItem?.image_path ? (
            <img src={IMAGE_API_URL + marketItem?.image_path} alt="상품이미지" className="w-screen rounded-xl" />
          ) : (
            <img src={`${API_URL}/image/profile.png`} alt="상품이미지" className="w-screen rounded-xl" />
          )}
        </a>
      </Col>
      <Col width={isCart ? '55' : '65'} className="p-1">
        <p className={`text-xs whitespace-pre-line ${stockPresent ? 'text-theme-black' : 'text-theme-gray-light'}`}>
          [{line_item.market_name}] {line_item.item_name}
        </p>
        <p
          className={`text-sm text-font-bold ${stockPresent ? 'text-theme-black' : 'text-theme-gray-light'}`}
        >{`${currency(line_item.unit_price * line_item.quantity)}원`}</p>
        {isCart && marketItem && stockPresent && (
          <Formik
            initialValues={{ quantity: line_item.quantity }}
            validationSchema={QuantitySchema}
            innerRef={formikRef}
            onSubmit={async (values, { setSubmitting }: FormikHelpers<QuantityValues>) => {
              f7.preloader.show();
              await setSubmitting(true);
              await changeQuantityMutation.mutate({ quantity: values.quantity });
              await setSubmitting(false);
            }}
            validateOnMount
          >
            {({ values, handleChange, handleSubmit, isSubmitting, isValid, setFieldValue }) => (
              <>
                {marketItem && limitYes(values.quantity) && (
                  <p className="text-xs mt-1" style={{ color: 'red' }}>
                    해당 상품은 한번에 {marketItem.limit_count}개까지 구매할 수 있어요.
                  </p>
                )}
                <div className="m-0 p-0 list no-hairlines">
                  <div
                    className="item-content item-input item-input-outline"
                    style={{ '--f7-list-item-padding-horizontal': '0px' }}
                  >
                    <div
                      className="item-inner"
                      style={{ '--f7-list-item-padding-vertical': '0px', justifyContent: 'flex-end' }}
                    >
                      <form onSubmit={handleSubmit} className="line-item-quantity-form">
                        <div className="flex">
                          <Button
                            className="p-0"
                            type="submit"
                            onClick={() => {
                              setLineItemsSum((value) => value - 1);
                              if (marketItem.limit_yes && values.quantity > marketItem.limit_count) {
                                setFieldValue('quantity', marketItem.limit_count);
                              } else {
                                values.quantity > 1 ? setFieldValue('quantity', values.quantity - 1) : values.quantity;
                              }
                            }}
                            disabled={isSubmitting || !isValid || values.quantity <= 1}
                          >
                            <img src={minusWithCircle} alt="" style={{ width: '2rem', height: '2rem' }} />
                          </Button>
                          <input
                            onChange={handleChange}
                            type="text"
                            readOnly
                            className="text-center text-xs"
                            style={{ height: 'auto', width: '3rem', padding: 0 }}
                            value={values.quantity}
                            min="1"
                            max={marketItem?.stock}
                          />
                          <Button
                            className="p-0"
                            type="submit"
                            onClick={() => {
                              if (!limitYes(values.quantity)) setFieldValue('quantity', values.quantity + 1);
                              setLineItemsSum((value) => value + 1);
                            }}
                            disabled={
                              isSubmitting ||
                              !isValid ||
                              values.quantity >= marketItem?.stock ||
                              limitYes(values.quantity)
                            }
                          >
                            <img src={plusWithCircle} alt="" style={{ width: '2rem', height: '2rem' }} />
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Formik>
        )}
      </Col>
      <Col className="p-1" width="10">
        <div className="text-xs text-theme-gray" onClick={() => onClickRemoveLineItem(line_item.id)}>
          삭제
        </div>
      </Col>
    </Row>
  );
};

export default React.memo(LineItemCard);
