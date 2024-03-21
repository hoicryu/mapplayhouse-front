import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { customToastState } from '@atoms';

const CustomToast = () => {
  const [openCustomToast, setOpenCustomToast] = useRecoilState(customToastState);
  const [onFaidOut, setOnFaidOut] = useState<boolean>(false);
  const [onTop, setOnTop] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (openCustomToast.open) {
        openToast();
      }
    })();
  }, [openCustomToast]);

  const openToast = () => {
    setOnTop(true);
    setTimeout(() => setOnFaidOut(true), 1000);
    setTimeout(downToast, 1400);
  };

  const downToast = () => {
    setOnTop(false);
    setOnFaidOut(false);
    setOpenCustomToast({ ...openCustomToast, open: false });
  };

  return (
    openCustomToast.open && (
      <div className="absolute w-full h-full bg-trans-black z-12000">
        <div
          className={`${openCustomToast.open ? 'flex' : 'hidden'} w-full justify-center items-${
            openCustomToast.position
          } absolute bottom-0`}
        >
          <div
            className={`relative flex justify-center items-center z-13000 rounded-2xl mb-5 px-3 py-3 w-5/6 
            ${onTop ? 'top-minus-30' : 'top-0'} ${openCustomToast.open && !onFaidOut ? 'fade-in' : ''} ${
              onFaidOut ? 'fade-out' : ''
            } bg-white`}
          >
            {openCustomToast.img ? (
              <img src={openCustomToast.img ? openCustomToast.img : ''} alt="" className="w-4 h-4 mr-1" />
            ) : (
              <img src={full_heart} alt="" className="w-4 h-4 mr-1" />
            )}
            <p className="flex">{openCustomToast.content}</p>
          </div>
        </div>
      </div>
    )
  );
};

export default React.memo(CustomToast);
