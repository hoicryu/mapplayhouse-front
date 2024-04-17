import React from 'react';
import { Page, PageContent } from 'framework7-react';
import useAuth from '@hooks/useAuth';
import { useQuery } from 'react-query';
import { PageRouteProps, Notice, Objects } from '@constants';
import { getObjects } from '@api';
import DefaultNav from '@components/shared/DefaultNav';
import Groups from '@components/shared/Groups';

const HomePage = ({ f7router }: PageRouteProps) => {
  const { currentUser, isAuthenticated, authenticateUser } = useAuth();
  const { data: notices, error } = useQuery<Objects<Notice>, Error>('notices', getObjects({ model_name: 'notice' }));

  return (
    <Page name="home" pageContent={false} className="relative">
      <DefaultNav />
      <PageContent>
        <p className="ml-3 font-semibold">이달의 작품</p>

        <p className="ml-3 font-semibold">모집중인 작품</p>
        <Groups />
      </PageContent>
    </Page>
  );
};
export default React.memo(HomePage);
