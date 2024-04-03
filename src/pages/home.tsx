import React, { useState, useEffect, useRef, useCallback } from 'react';
import { f7, Page, Navbar, NavLeft, NavRight, Link, PageContent } from 'framework7-react';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import useAuth from '@hooks/useAuth';
import Banners from '@components/shared/Banners';
import { useMutation, useQueryClient } from 'react-query';
import { PageRouteProps } from '@constants';
import { groupBy } from 'lodash';
import SheetConfirm from '@components/shared/SheetConfirm';
import SheetAlert from '@components/shared/SheetAlert';

const HomePage = ({ f7router }: PageRouteProps) => {
  const { currentUser, isAuthenticated, authenticateUser } = useAuth();

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
