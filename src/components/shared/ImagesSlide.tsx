import React from 'react';
import { SwiperSlide, Swiper } from 'framework7-react';
import { getImages, IMAGE_API_URL } from '@api';
import { Image, MarketItem } from '@constants';
import { useQuery } from 'react-query';
import { map } from 'lodash';

interface ImagesSlideProps {
  imagableType: string;
  imagableId: number;
  marketItem?: MarketItem;
  isItemShow?: boolean;
  isBasicImage?: boolean;
}

const ImagesSlide = ({
  imagableType,
  imagableId,
  marketItem,
  isItemShow = false,
  isBasicImage = false,
}: ImagesSlideProps) => {
  const IMAGES_KEY = `images_${imagableType}_${imagableId}`;

  const { data: images } = useQuery<Image[], Error>(
    IMAGES_KEY,
    getImages({ q: { imagable_type_eq: imagableType, imagable_id_eq: imagableId } }),
    {
      enabled: !!imagableType && !!imagableId,
    },
  );

  return (
    <>
      {images && (
        <Swiper
          className={`${!isItemShow && 'pagination-right rounded-2xl relative'}`}
          pagination
          speed={500}
          autoHeight={isBasicImage}
          slidesPerView={1}
          pagination={{ type: 'fraction' }}
        >
          {isItemShow && (
            <SwiperSlide>
              <img src={`${IMAGE_API_URL + marketItem.image_path}`} alt="" className="open-photo-browser w-full" />
            </SwiperSlide>
          )}
          {imagableId &&
            map(images, (image: Image, i) => (
              <SwiperSlide key={`image_${image?.id}` || `image_${i}`}>
                {isBasicImage ? (
                  <img src={`${IMAGE_API_URL + image.basic_image_path}`} alt="" className="open-photo-browser w-full" />
                ) : (
                  <img src={`${IMAGE_API_URL + image.image_path}`} alt="" className="open-photo-browser w-full" />
                )}
              </SwiperSlide>
            ))}
        </Swiper>
      )}
    </>
  );
};
export default React.memo(ImagesSlide);
