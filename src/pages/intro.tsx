import { Button, f7ready, Page, Navbar, Swiper, SwiperSlide, Toolbar } from 'framework7-react';
import React, { useEffect, useState } from 'react';
import { Pagination } from 'swiper';
import sanitizeHtml from '../js/utils/sanitizeHtml';

const IntroPage = (props) => {
  const [slides, setSlides] = useState([]);
  let images: string[] = [
    'couple',
    'segment',
    'chilling',
    'choose',
    'chatting',
    'confirmed',
    'agreement',
    'grades',
    'brainstorming',
    'hiring',
    'love',
    'messages1',
    'development',
    'team',
    'together',
    'space',
    'mobile',
    'website',
    'easter',
    'romantic',
    'tasting',
    'drone',
    'coding',
    'mindfulness',
    'artificial',
    'celebration',
    'virtual',
    'doggy',
    'static',
    'healthy',
    'data',
    'sleep',
    'force',
    'makeup',
    'bicycle',
    'podcast',
    'fishing',
    'credit',
    'workout',
    'pilates',
    'group',
    'mouth',
    'school',
  ];

  useEffect(() => {
    f7ready(async (f7) => {
      setSlides(
        _.zip(_.sampleSize(images, 3), [
          "<script>console.log('a')</script>\n인썸니아의 사전<br/> 구축 기능 \n 시연용 앱입니다",
          '사전 구축 기능을 선택하면',
          '이미 구현된 기능을 활용해<br/>개발 비용이 절감됩니다',
        ]),
      );
    });
  }, []);

  return (
    <Page noToolbar>
      <Navbar noShadow transparent sliding={false} />
      <Toolbar className="bottom-32">
        <div className="w-full flex">
          <Button className="w-full rounded-none" large href="/users/sign_in">
            로그인
          </Button>
          <Button className="w-full rounded-none" large href="/users/sign_up" fill>
            회원가입
          </Button>
        </div>
      </Toolbar>
      <Swiper
        className="h-full"
        spaceBetween={30}
        slidesPerView={1}
        centeredSlides={true}
        pagination={{ clickable: true }}
        observer
      >
        {slides.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="flex justify-center p-0 ">
              <img src={`https://insomenia.com/svgs/${item[0]}`} alt="" />
            </div>

            {sanitizeHtml(item[1], { className: 'text-lg text-center pt-4' })}
          </SwiperSlide>
        ))}
      </Swiper>
    </Page>
  );
};
export default React.memo(IntroPage);
