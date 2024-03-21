import React from 'react';
import { f7 } from 'framework7-react';
import noData from '@assets/icons/no_data.png';
import { Router } from 'framework7/types';
import { sleep } from '@utils';

interface NoDataProps {
  content: string;
  clickEventContent?: string;
  navigateUrl?: string;
  buttonContent?: string;
  f7router?: Router.Router;
  icon?: any;
}

const NoData = ({ content, clickEventContent, navigateUrl, buttonContent, f7router, icon }: NoDataProps) => (
  <div className="mt-16">
    <img src={noData} alt="" className="w-12 h-12 m-auto" />
    <div className="text-lg text-font-bold text-theme-black text-center mt-2">{content}</div>
    {buttonContent && (
      <div className="text-center mt-4">
        <button
          type="button"
          className={`text-font-bold border-2 border-theme-blue rounded-full py-2 px-3 m-auto text-theme-black text-sm w-48 text-center ${
            icon && 'flex justify-center items-center'
          }`}
          onClick={async () => {
            if (clickEventContent) {
              f7router.back();
              await sleep(500);
              f7.tab.show(clickEventContent);
              window.dispatchEvent(new CustomEvent('scrollHomeToTop'));
            }
            if (navigateUrl) {
              f7router.navigate(navigateUrl);
            }
          }}
        >
          {buttonContent}
          {icon && <img src={icon} alt="" className="w-5 h-5 m-0 ml-2" />}
        </button>
      </div>
    )}
  </div>
);

export default React.memo(NoData);
