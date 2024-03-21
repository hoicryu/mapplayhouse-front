import React, { useState } from 'react';
import { f7 } from 'framework7-react';
import { Like, Market, PageRouteProps } from '@constants';
import useAuth from '@hooks/useAuth';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getLikeIds } from '@selectors';
import { currentMarketId } from '@atoms';
import { useMutation, useQueryClient } from 'react-query';
import { getLastMarketId, updateMarketId } from '@api';
import Rating from 'react-rating';
import grayRightArrow from '@assets/icons/gray_right_arrow.png';
import fullHeart from '@assets/icons/full_heart.png';
import emptyWhiteHeart from '@assets/icons/empty_white_heart.png';
import phone from '@assets/icons/phone.png';
import share from '@assets/icons/share.png';
import useLikeMutation from '@hooks/useLikeMutation';
import CommonHr from './CommonHr';
import SheetAlert from './SheetAlert';

interface MarketProps extends PageRouteProps {
  market: Market;
}

const MarketCard = ({ market, f7router }: MarketProps) => {
  const { isAuthenticated, authenticateUser } = useAuth();
  const setMarketId = useSetRecoilState(currentMarketId);
  const targetLikes: Like[] = useRecoilValue(getLikeIds(market.model_name));
  const queryClient = useQueryClient();
  const [alertSheetOpened, setAlertSheetOpened] = useState<boolean>(false);
  const [alertSheetContent, setAlertSheetContent] = useState<string>('');
  const { createMutate, deleteMutate } = useLikeMutation();

  const UpdateMarketId = useMutation(updateMarketId(), {
    onError: () => {
      setAlertSheetContent('에러가 발생했습니다');
      setAlertSheetOpened(true);
    },
  });

  const onClickLike = () => {
    const targetLike = targetLikes.find((like: Like) => like.target_id === market.id);
    if (isAuthenticated) {
      if (targetLike) {
        deleteMutate(targetLike.id);
      } else {
        createMutate({ target_type: 'Market', target_id: market.id });
      }
    } else {
      f7router.navigate('/users/sign_in');
    }
  };

  const onClickMarket = (id: number) => {
    f7.dialog.preloader('잠시만 기다려주세요...');
    UpdateMarketId.mutate(
      { market_id: id },
      {
        onSuccess: async (res) => {
          const { result, market_id, signed_in, token, csrf } = res;
          if (isAuthenticated) authenticateUser({ token, csrf });
          if (result || !signed_in) {
            f7.dialog.close();
            await queryClient.prefetchQuery('last_market_id', getLastMarketId());
            await setMarketId(parseInt(market_id, 10));
            await window.location.reload();
          } else {
            f7.dialog.close();
            setAlertSheetContent('에러가 발생했습니다');
            setAlertSheetOpened(true);
          }
        },
      },
    );
  };

  return (
    <>
      <SheetAlert
        sheetOpened={alertSheetOpened}
        setSheetOpened={setAlertSheetOpened}
        content={alertSheetContent}
        btnText="확인"
      />
      {market && (
        <div className="w-full p-2">
          <div className="bg-white p-4 w-full flex justify-between">
            <div className="w-100">
              <div className="text-theme-black text-lg text-font-bold flex items-center">
                {market.name}
                <img
                  src={grayRightArrow}
                  alt=""
                  onClick={() => onClickMarket(market.id)}
                  className="w-3 h-3 ml-1 bg-theme-black rounded-full"
                />
              </div>
              <div className="flex items-center row-span-1 flex justify-between mr-2">
                <div className="block text-center">
                  <div className="flex items-center">
                    <Rating
                      initialRating={market.reviews_average}
                      fractions={2}
                      emptySymbol={<img src={emptyWhiteHeart} alt="" className="icon w-4 h-4" />}
                      fullSymbol={<img src={fullHeart} alt="" className="icon w-4 h-4 max-w-none" />}
                      readonly
                    />
                    <p className="text-theme-black text-xs ml-1">({market.reviews_count || 0}개)</p>
                  </div>
                </div>
              </div>
              <span className="" style={{ fontSize: '10px' }}>
                {market.address1}
              </span>
            </div>
            <div className="flex items-end">
              <div className="border border-theme-gray-light rounded-full h-6 w-6 p-1 mr-2">
                <a onClick={onClickLike}>
                  <img
                    src={
                      targetLikes.map((like: Like) => like.target_id).includes(market.id) ? fullHeart : emptyWhiteHeart
                    }
                    alt=""
                    style={{ width: '1rem', height: '1rem' }}
                  />
                </a>
              </div>
              <div className="border border-theme-gray-light rounded-full h-6 w-6 p-1 mr-2">
                <a href={`tel:${market.phone}`} className="external">
                  <img src={phone} alt="" style={{ width: '1rem', height: '1rem' }} />
                </a>
              </div>
              <div className="border border-theme-gray-light rounded-full h-6 w-6 p-1 mr-2">
                <img src={share} alt="" style={{ width: '1rem', height: '1rem' }} />
              </div>
            </div>
          </div>
        </div>
      )}
      <CommonHr />
    </>
  );
};

export default React.memo(MarketCard);
