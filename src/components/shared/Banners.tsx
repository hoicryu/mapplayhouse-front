import { getObjects, IMAGE_API_URL } from '@api';
import { Banner, Objects } from '@constants';
import { objectsSkeletonPlaceholder } from '@js/utils';
import { Swiper, SwiperSlide } from 'framework7-react';
import React, { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import SwiperCore, { Autoplay } from 'swiper';

SwiperCore.use([Autoplay]);
const Banners: React.FC<any> = ({ inView }) => {
  const { data: banners, isError, isSuccess } = useQuery<Objects<Banner>, Error>(
    'banners',
    getObjects({ model_name: 'banner', q: { status_eq: 'main' } }),
    {
      placeholderData: objectsSkeletonPlaceholder(2),
    },
  );

  const swiperRef = useRef(null);

  useEffect(() => {
    if (inView && swiperRef.current) {
      swiperRef.current.activeIndex = 0;
    }
  }, [inView]);
  if (isError) {
    return (
      <div className="h-32 flex items-center justify-center">
        <span className="text-theme-gray">서버에 문제가 발생 했습니다. </span>
      </div>
    );
  }

  const bannerCard = (banner) => (
    <a
      href="#"
      rel="noopener noreferrer"
      target={banner.is_external ? '_blank' : ''}
      onClick={(e) => {
        e.preventDefault();
        if (banner.is_external) window.open(banner.link);
      }}
    >
      <img src={IMAGE_API_URL + banner.image_path} alt="#" className="h-auto w-full rounded-2xl" />
    </a>
  );

  return (
    <>
      {isSuccess && (
        <div>
          {banners.objects.length === 1 ? (
            <div className="p-3">{bannerCard(banners.objects[0])}</div>
          ) : (
            <Swiper
              onInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              pagination
              speed={500}
              autoplay={{
                delay: 3500,
                waitForTransition: false,
                disableOnInteraction: false,
              }}
              slidesPerView={1.1}
              centeredSlides
              spaceBetween={10}
              observer
              loop
              className="m-2 pagination-right relative banner-box"
              pagination={{ type: 'fraction' }}
            >
              {banners.objects.map((banner: Banner, idx) => (
                <SwiperSlide
                  key={banner?.id || idx}
                  className="bg-white flex flex-col items-center justify-center shadow-md rounded-2xl"
                >
                  {bannerCard(banner)}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      )}
    </>
  );
};
export default React.memo(Banners);
