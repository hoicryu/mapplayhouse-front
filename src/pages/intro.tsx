import { f7ready, Page, Navbar } from 'framework7-react';
import React, { useEffect, useState } from 'react';
import defaultImg from '@assets/icons/mapmark.png';

const IntroPage = (props) => {
  useEffect(() => {
    f7ready(async (f7) => {});
  }, []);

  return (
    <Page noToolbar>
      <Navbar noShadow transparent sliding={false} />
      <div className="w-full flex items-center" style={{ background: '#F5F5E7' }}>
        <div className="w-32 p-2">
          <img src={defaultImg} alt="#" className="h-auto  rounded-2xl" />
        </div>
      </div>
    </Page>
  );
};
export default React.memo(IntroPage);
