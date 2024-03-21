import React from 'react';

interface FooterProps {
  lineYes?: boolean;
}
const Footer = ({ lineYes }: FooterProps) => (
  <div className="px-5 pb-8 text-xs">
    {lineYes && <hr />}
    <div className="text-theme-black text-sm mb-1 mt-8">(주)다안로지스</div>
    <div style={{ color: '#AFAFAF' }}>
      <p>통신판매번호: 2019-서울성동-01183</p>
      <p>사업자 등록번호 739-86-01381</p>
      <p>대표자 김도연 | 서울시 성동구 용답23길21(주)다안로지스</p>
      <p>전화 070-4206-4929 | 이메일 zipmarket@kakao.com</p>
    </div>
  </div>
);

export default React.memo(Footer);
