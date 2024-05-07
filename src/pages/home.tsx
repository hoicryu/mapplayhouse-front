import React from 'react';
import { Page, PageContent } from 'framework7-react';
import useAuth from '@hooks/useAuth';
import { useQuery } from 'react-query';
import { PageRouteProps, Notice, Objects } from '@constants';
import { getObjects } from '@api';
import DefaultNav from '@components/shared/DefaultNav';
import Groups from '@components/shared/Groups';
import BeforeGroup from '@components/shared/BeforeGroup';
import Videos from '@components/shared/Videos';
import Images from '@components/shared/Images';

const HomePage = ({ f7router }: PageRouteProps) => {
  const { currentUser, isAuthenticated, authenticateUser } = useAuth();
  const { data: notices, error } = useQuery<Objects<Notice>, Error>('notices', getObjects({ model_name: 'notice' }));

  return (
    <Page name="home" pageContent={false} className="relative">
      <DefaultNav />
      <PageContent>
        <div className="mb-10">
          <BeforeGroup />
          <p className="mt-7 mb-4 ml-4 text-base font-semibold">모집중</p>
          <Groups />
          <p className="mt-7 mb-4 ml-4 text-base font-semibold">무대 사진</p>
          <Images />
          <p className="mt-7 mb-4 ml-4 text-base font-semibold">뮤지컬 영상</p>
          <Videos />
        </div>
      </PageContent>
    </Page>
  );
};
export default React.memo(HomePage);
