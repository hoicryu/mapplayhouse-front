import React from 'react';
import { Navbar, NavTitle } from 'framework7-react';

interface NavProps {
  title?: string;
}

const BackLinkNav = ({ title = '' }: NavProps) => {
  return (
    <Navbar backLink noShadow noHairline innerClassName="bg-white relative">
      <NavTitle>{title}</NavTitle>
    </Navbar>
  );
};
export default React.memo(BackLinkNav);
