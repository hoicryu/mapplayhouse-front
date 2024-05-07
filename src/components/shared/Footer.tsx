import React from 'react';

interface FooterProps {
  lineYes?: boolean;
}
const Footer = ({ lineYes }: FooterProps) => (
  <div className="px-5 pb-8 text-xs">
    {lineYes && <hr />}
    <div className="text-theme-black text-sm mb-1 mt-8">맵플레이하우스</div>
    <div style={{ color: '#AFAFAF' }}>
      <p>블라블라</p>
    </div>
  </div>
);

export default React.memo(Footer);
