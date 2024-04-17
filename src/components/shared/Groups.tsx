import { getObjects, IMAGE_API_URL } from '@api';
import { Objects, Group } from '@constants';
import { objectsSkeletonPlaceholder } from '@js/utils';
import { Swiper, SwiperSlide, Link } from 'framework7-react';
import React, { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import SwiperCore, { Autoplay } from 'swiper';

SwiperCore.use([Autoplay]);
const Groups: React.FC<any> = ({ inView }) => {
  const { data: groups, isError, isSuccess } = useQuery<Objects<Group>, Error>(
    'groups',
    getObjects({ model_name: 'group', q: { status_eq: 'recruiting' } }),
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

  const groupCard = (group) => (
    <Link href={`/application_forms/new?group_id=${group.id}`} className="relative">
      <div className="absolute top-0 left-0 w-full h-full bg-trans-black"></div>
      <img src={IMAGE_API_URL + group.musical?.image_path} alt="#" className="h-auto w-full" />
      <p className="z-50 absolute bottom-8 left-5 text-2xl text-white font-bold">{group.musical?.title}</p>
    </Link>
  );

  return (
    <>
      {isSuccess && (
        <div className="">
          {groups.objects.length === 1 ? (
            <div className="">{groupCard(groups.objects[0])}</div>
          ) : (
            <Swiper
              onInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              speed={500}
              autoplay={{
                delay: 5000,
                waitForTransition: false,
                disableOnInteraction: false,
              }}
              slidesPerView={1.3}
              centeredSlides
              spaceBetween={20}
              observer
              loop
              className="m-2 pagination-right relative banner-box"
              pagination
            >
              {groups.objects.map((group: Group, idx) => (
                <SwiperSlide
                  key={group?.id || idx}
                  className="bg-white flex flex-col items-center justify-center shadow-md rounded-2xl"
                >
                  {groupCard(group)}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      )}
    </>
  );
};
export default React.memo(Groups);
