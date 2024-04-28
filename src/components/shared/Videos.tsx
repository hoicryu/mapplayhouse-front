import { getVideos } from '@api';
import { Video } from '@constants';
import { Swiper, SwiperSlide, Link } from 'framework7-react';
import React, { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import YouTube, { YouTubeProps } from 'react-youtube';

const Videos: React.FC<any> = ({ inView }) => {
  const { data: videos, isError, isSuccess } = useQuery<Video[]>('videos', getVideos());
  const swiperRef = useRef(null);

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
  };
  const opts: YouTubeProps['opts'] = {
    height: '200',
    width: '300',
    playerVars: {
      autoplay: 1,
    },
  };

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

  return <YouTube videoId="2g811Eo7K8U" opts={opts} onReady={onPlayerReady} />;
};
export default React.memo(Videos);
