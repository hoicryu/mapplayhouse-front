import React from 'react';
import { NavLeft, Navbar, NavTitle } from 'framework7-react';

interface NavProps {
  title?: string;
}

const DefaultNav = ({ title = '' }: NavProps) => {
  return (
    <Navbar noShadow sliding={false} noHairline innerClassName="bg-white relative">
      <NavLeft>
        <span className="ml-2 font-jersey">M . A . P</span>
      </NavLeft>
      <NavTitle>{title}</NavTitle>
    </Navbar>
  );
};
export default React.memo(DefaultNav);
