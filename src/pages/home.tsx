import React from 'react';
import { NavLeft, Navbar, Page, PageContent } from 'framework7-react';
import useAuth from '@hooks/useAuth';
import { useQuery } from 'react-query';
import { PageRouteProps } from '@constants';
import { Notice, Objects } from '@constants';
import { getObjects } from '@api';
import Groups from '@components/shared/Groups';
import Icon from '@assets/icons/mapmark-sm.png';

const HomePage = ({ f7router }: PageRouteProps) => {
  const { currentUser, isAuthenticated, authenticateUser } = useAuth();
  const { data: notices, error } = useQuery<Objects<Notice>, Error>('notices', getObjects({ model_name: 'notice' }));

  return (
    <Page name="home" pageContent={false} className="relative">
      <Navbar noShadow sliding={false} noHairline innerClassName="bg-white">
        <NavLeft>
          <span className="font-jersey">M . A . P</span>
          <img className="ml-2" width="25" src={Icon} alt="" />
        </NavLeft>
      </Navbar>
      <PageContent>
        <p className="ml-3 font-semibold">모집중인 작품</p>
        <Groups />
      </PageContent>
    </Page>
  );
};
export default React.memo(HomePage);
