/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getLikeIds } from '@selectors';
import { MarketItem, Like, Market } from '@constants';
import useAuth from '@hooks/useAuth';
import emptyWhiteHeart from '@assets/icons/empty_white_heart.png';
import heartBlueBorder from '@assets/icons/heart_blue_border.png';
import useLikeMutation from '@hooks/useLikeMutation';
import { customToastState } from '@atoms';
import fullHeart from '@assets/icons/full_heart.png';

interface HeartContainerProps {
  target: MarketItem | Market; // 다른 모델 추가하려면 | User 이런식으로 추가 하기
  className?: string;
  heartClassName?: string;
  anchorTagClassName?: string;
  setLikesCount?: any;
  empty_heart_icon?: string;
}

const HeartContainer = ({
  target,
  className,
  heartClassName,
  anchorTagClassName,
  setLikesCount,
  empty_heart_icon = 'heart_blue_border',
}: HeartContainerProps) => {
  const targetLikes: Like[] = useRecoilValue(getLikeIds(target.model_name));
  const { isAuthenticated } = useAuth();
  const { createMutate, deleteMutate } = useLikeMutation();
  const [openCustomToast, setOpenCustomToast] = useRecoilState(customToastState);

  const onClickLike = () => {
    const targetLike = targetLikes.find((like: Like) => like.target_id === target.id);
    targetLike
      ? deleteMutate(targetLike.id, {
          onSuccess: () => {
            setLikesCount((count) => count - 1);
          },
        })
      : createMutate(
          { target_type: target.model_name, target_id: target.id },
          {
            onSuccess: () => {
              setLikesCount((count) => count + 1);
            },
          },
        );
  };

  const heartImage = () => {
    if (targetLikes.map((like: Like) => like.target_id).includes(target.id)) return fullHeart;
    return empty_heart_icon === 'heart_blue_border' ? heartBlueBorder : emptyWhiteHeart;
  };

  return (
    <>
      <div className={className}>
        <a
          onClick={
            isAuthenticated
              ? onClickLike
              : () => setOpenCustomToast({ ...openCustomToast, content: '로그인 후 이용해주세요.', open: true })
          }
          className={anchorTagClassName}
        >
          <img className={`${heartClassName}`} src={heartImage()} alt="" />
        </a>
      </div>
    </>
  );
};

export default React.memo(HeartContainer);
