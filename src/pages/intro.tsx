import React, { useEffect, useState } from 'react';
import defaultImg from '@assets/icons/mapmark.png';

const IntroPage = (props) => {
  const [onIntro, setOnIntro] = useState<boolean>(true);
  useEffect(() => {
    const timer = setTimeout(function () {
      setOnIntro(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`z-13000 absolute top-0 w-full h-full flex justify-center items-center 
      ${onIntro ? '' : 'fade-out-intro'}`}
      id="intro-page"
      style={{ background: '#F5F5E7' }}
    >
      <div className="w-1/2 p-2">
        <img src={defaultImg} alt="#" className="h-auto rounded-2xl" />
      </div>
    </div>
  );
};
export default React.memo(IntroPage);
