import React, { useState } from 'react';
import { Link } from 'framework7-react';
import { API_URL, IMAGE_API_URL } from '@api';
import { EmptyConfirm, MarketItem } from '@constants';
import { currency, saleRate } from '@js/utils';
import useLineItemMutations from '@hooks/useLineItemMutations';
import cart from '@assets/icons/cart.png';
import HeartContainer from './HeartContainer';
import SheetConfirm from './SheetConfirm';
import { Router } from 'framework7/types';
import LineItemEmptyConfirm from './LineItemEmptyConfirm';

interface DiscountItemCardProp {
  marketItem: MarketItem;
  heartPosition: string;
  cartPosition: string;
  f7router: Router.Router;
}

const DiscountItemCard = ({ marketItem, heartPosition, cartPosition, f7router }: DiscountItemCardProp) => {
  const { onClickAddCart } = useLineItemMutations();
  const [likesCount, setLikesCount] = useState<number>(marketItem.likes_count);
  const [confirmSheetOpened, setConfirmSheetOpened] = useState<boolean>(false);
  const [emptyConfirmOpen, setEmptyConfirmOpen] = useState<EmptyConfirm>({
    open: false,
    quantity: 0,
    marketItemId: 0,
  });

  const goOnCartList = () => {
    setConfirmSheetOpened(false);
    f7router.navigate(`/line_items`);
  };

  return (
    <>
      <SheetConfirm
        content="장바구니에 잘 담겼어요 :D"
        cancelText="쇼핑 계속하기"
        confirmText="장바구니로 가기"
        sheetOpened={confirmSheetOpened}
        setSheetOpened={setConfirmSheetOpened}
        confirmCallback={goOnCartList}
      />
      <LineItemEmptyConfirm
        content="선택하신 상품을 장바구니에 담을 경우 <br/>이전에 담은 상품이 삭제됩니다.<br/>
          장바구니에는 같은 가게의 상품만을 <br/>담을 수 있습니다."
        cancelText="쇼핑 계속하기"
        confirmText="비우고 넣기"
        emptyConfirmOpen={emptyConfirmOpen}
        sheetOpened={emptyConfirmOpen.open}
        setSheetOpened={setEmptyConfirmOpen}
        confirmCallback={setConfirmSheetOpened}
      />

      <li className={`w-full p-2 text-sm media-item list-none ${marketItem.stock === 0 && 'opacity-60'}`}>
        <a href={`/market_items/${marketItem.id}`} className="item-link">
          <div className="item-content">
            <div className="item-media relative" style={{ paddingTop: 0 }}>
              {marketItem.stock === 0 && (
                <div className="absolute top-0 left-0" style={{ top: 0, left: 0 }}>
                  <div
                    className="bg-theme-blue px-4 py-1 relative text-xs rounded-tl-lg w-full text-white"
                    style={{ borderTopLeftRadius: '0.5rem' }}
                  >
                    품절
                  </div>
                </div>
              )}
              {marketItem?.image_path ? (
                <img src={IMAGE_API_URL + marketItem?.image_path} className="w-full m-auto radius rounded-lg shadow" />
              ) : (
                <img src={`${API_URL}/image/profile.png`} className="w-full m-auto radius rounded-lg shadow" />
              )}
            </div>
            <div className="item-inner" style={{ paddingTop: '3px', margin: '0px', width: '100%' }}>
              <div className="item-title-row">
                <div className="item-title text-sm truncate" style={{ fontWeight: 400 }}>
                  {marketItem.item_name}
                </div>
              </div>
              <div className="item-subtitle text-xs text-font-bold text-theme-gray text-opacity-40 line-through mt-1">
                {`${currency(marketItem.list_price)}원`}
              </div>
              <div className="item-subtitle mt-1 text-right">
                <span className="text-base mr-1 text-font-bold text-theme-orange">{saleRate(marketItem)}%</span>
                <span className="text-sm text-font-bold">혜택가 {`${currency(marketItem.sale_price)}원`}</span>
              </div>
            </div>
          </div>
        </a>
      </li>
      <Link
        onClick={() => {
          onClickAddCart(marketItem.id, 1, marketItem.stock, setConfirmSheetOpened, setEmptyConfirmOpen);
        }}
        className={`absolute z-50 ${cartPosition}`}
      >
        <img src={cart} alt="" width="23" style={{ marginBottom: '2px' }} />
      </Link>
      <HeartContainer
        target={marketItem}
        heartClassName={`absolute z-50 ${heartPosition} text-theme-blue text-xl text-center w-6 mr-1`}
        setLikesCount={setLikesCount}
      />
    </>
  );
};

export default React.memo(DiscountItemCard);
