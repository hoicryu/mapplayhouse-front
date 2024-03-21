import React, { useState } from 'react';
import { Like, Market, PageRouteProps } from '@constants';
import { Col, Row } from 'framework7-react';
import useAuth from '@hooks/useAuth';
import { useRecoilValue } from 'recoil';
import { getLikeIds } from '@selectors';
import { userLatitude, userLongitude } from '@atoms';
import { currency } from '@js/utils';
import { getDistance } from 'geolib';
import ruler from '@assets/icons/ruler.png';
import full_heart from '@assets/icons/full_heart.png';
import empty_white_heart from '@assets/icons/empty_white_heart.png';
import phone from '@assets/icons/phone.png';
import share from '@assets/icons/share.png';
import grayRightArrow from '@assets/icons/gray_right_arrow.png';
import useLikeMutation from '@hooks/useLikeMutation';

interface MarketProps extends PageRouteProps {
  market: Market;
  onClickMarket(id: number): void;
  onClickLogoutMarket(id: number): void;
}

const MarketCard = ({ market, onClickMarket, onClickLogoutMarket, f7router }: MarketProps) => {
  const { isAuthenticated } = useAuth();
  const currentLatitude = useRecoilValue<number>(userLatitude);
  const currentLongitude = useRecoilValue<number>(userLongitude);
  const [likesCount, setLikesCount] = useState<number>(market.likes_count || 0);
  const targetLikes: Like[] = useRecoilValue(getLikeIds(market.model_name));
  const { createMutate, deleteMutate } = useLikeMutation();

  const onClickLike = () => {
    const targetLike = targetLikes.find((like: Like) => like.target_id === market.id);
    if (isAuthenticated) {
      if (targetLike) {
        deleteMutate(targetLike.id, {
          onSuccess: () => {
            setLikesCount((count) => count - 1);
          },
        });
      } else {
        createMutate(
          { target_type: 'Market', target_id: market.id },
          {
            onSuccess: () => {
              setLikesCount((count) => count + 1);
            },
          },
        );
      }
    } else {
      f7router.navigate('/users/sign_in');
    }
  };

  return (
    <>
      <div className="w-full py-2">
        <div className="bg-white shadow-lg rounded-2xl p-4 w-full flex justify-between items-center">
          <Row noGap className="items-center w-100">
            <Col width="85">
              <Row noGap>
                <Col width="45">
                  <a
                    href={`/markets/${market.id}`}
                    className="link"
                    onClick={() => {
                      onClickMarket(market.id);
                    }}
                  >
                    <div
                      className={`text-font-bold ${
                        market.status === 'onsale' ? 'text-theme-blue' : 'text-theme-gray-light'
                      }`}
                    >
                      {market.name}
                    </div>
                  </a>
                </Col>
                <Col width="55">
                  <div className="flex items-center row-span-1 flex justify-between">
                    <div
                      className={`badge text-xs p-2 ${
                        market.status === 'onsale' ? 'bg-theme-blue' : 'bg-theme-gray-light'
                      } text-font-bold`}
                      style={{ fontSize: '10px', height: '14px' }}
                    >
                      {market.status === 'onsale' ? '주문가능' : '준비중'}
                    </div>
                    <div className="flex items-center text-theme-black" style={{ fontSize: '10px' }}>
                      <img src={ruler} alt="" style={{ width: '1rem', height: '1rem' }} />
                      {currentLatitude &&
                        currentLongitude &&
                        currency(
                          getDistance(
                            { latitude: currentLatitude, longitude: currentLongitude },
                            { latitude: market.lat, longitude: market.lng },
                          ),
                        )}
                      m
                    </div>
                    <div className="block text-center">
                      <div className="flex items-center">
                        <img src={full_heart} alt="" className="w-4 h-4" style={{ marginRight: '3px' }} />
                        <p className="text-theme-black text-xs">{likesCount || 0}</p>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col width="100">
                  <span className="" style={{ fontSize: '11px' }}>
                    {market.address1}
                  </span>
                </Col>
                {market.opened_at && market.closed_at && (
                  <Col width="100" style={{ lineHeight: '6px', marginBottom: '6px' }}>
                    <span className="" style={{ fontSize: '6px', lineHeight: '6px' }}>
                      {`운영시간 ${market.opened_at} ~ ${market.closed_at}`}
                      {market.rest_day && ` / 휴무일 ${market.rest_day}`}
                    </span>
                  </Col>
                )}

                <Col width="100" className="flex">
                  <div className="border border-theme-gray-light rounded-full h-6 w-6 p-1 mr-2">
                    {isAuthenticated ? (
                      <a onClick={() => onClickLike()}>
                        <img
                          src={
                            targetLikes.map((like: Like) => like.target_id).includes(market.id)
                              ? full_heart
                              : empty_white_heart
                          }
                          alt=""
                          style={{ width: '1rem', height: '1rem' }}
                        />
                      </a>
                    ) : (
                      <a href="/users/sign_in" onClick={() => onClickLogoutMarket(market.id)}>
                        <img src={empty_white_heart} alt="" style={{ width: '1rem', height: '1rem' }} />
                      </a>
                    )}
                  </div>
                  <div className="border border-theme-gray-light rounded-full h-6 w-6 p-1 mr-2">
                    <a href={`tel:${market?.phone}`} className="external">
                      <img src={phone} alt="" style={{ width: '1rem', height: '1rem' }} />
                    </a>
                  </div>
                  <div className="border border-theme-gray-light rounded-full h-6 w-6 p-1 mr-2">
                    <img src={share} alt="" style={{ width: '1rem', height: '1rem' }} />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col width="15">
              <a
                href={`/markets/${market.id}`}
                onClick={() => {
                  onClickMarket(market.id);
                }}
              >
                <img src={grayRightArrow} alt="" className="ml-auto" style={{ width: '2.5rem', height: '2.5rem' }} />
              </a>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default React.memo(MarketCard);
