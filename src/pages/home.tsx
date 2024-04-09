import React, { useState, useEffect, useRef, useCallback } from 'react';
import { f7, Page, Navbar, NavLeft, NavRight, Link, PageContent } from 'framework7-react';
import useAuth from '@hooks/useAuth';
import { useQuery } from 'react-query';
import { PageRouteProps } from '@constants';
import { Notice, Objects } from '@constants';
import { groupBy } from 'lodash';
import SheetConfirm from '@components/shared/SheetConfirm';
import SheetAlert from '@components/shared/SheetAlert';
import { getObjects } from '@api';

const HomePage = ({ f7router }: PageRouteProps) => {
  const { currentUser, isAuthenticated, authenticateUser } = useAuth();

  const { data: notices, error } = useQuery<Objects<Notice>, Error>('notices', getObjects({ model_name: 'notice' }));
  console.log(notices);

  return (
    <Page name="home" pageContent={false} className="relative">
      <Navbar noShadow sliding={false} noHairline className="bg-opacity-white">
        <NavLeft></NavLeft>
        <NavRight></NavRight>
      </Navbar>
    </Page>
  );
};
export default React.memo(HomePage);
