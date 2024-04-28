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

const HomePage = ({ f7router }: PageRouteProps) => {
  const { currentUser, isAuthenticated, authenticateUser } = useAuth();
  const { data: notices, error } = useQuery<Objects<Notice>, Error>('notices', getObjects({ model_name: 'notice' }));

  return (
    <Page name="home" pageContent={false} className="relative">
      <DefaultNav />
      <PageContent>
        <BeforeGroup />
        <p className="my-6 ml-4 text-lg font-semibold">모집중</p>
        <Groups />
        <Videos />
      </PageContent>
    </Page>
  );
};
export default React.memo(HomePage);
