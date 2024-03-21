import React from 'react';
import { Sheet } from 'framework7-react';

interface SheetAlertProps {
  sheetOpened: boolean;
  setSheetOpened: React.Dispatch<React.SetStateAction<boolean>>;
  content?: any;
  btnText: string;
  subContent?: string;
  img_url?: string;
}
const SheetAlert = ({ sheetOpened, setSheetOpened, content, btnText, subContent, img_url }: SheetAlertProps) => (
  <Sheet
    backdrop
    opened={sheetOpened}
    onSheetClosed={() => {
      setSheetOpened(false);
    }}
    className="rounded-2xl h-auto p-5 pb-8"
  >
    {content && (
      <div
        className={`flex justify-center items-center text-center text-font-bold text-sm ${
          subContent ? 'mb-2' : 'mb-4'
        }`}
      >
        {!subContent && img_url && <img src={img_url} alt="" className="w-4 h-4 mr-1" />}
        <span dangerouslySetInnerHTML={{ __html: content }}></span>
      </div>
    )}
    {subContent && (
      <div className="flex justify-center items-center text-font-bold text-xs mb-2 text-theme-gray">
        {img_url && <img src={img_url} alt="" className="w-4 h-4 mr-1" />}
        <span>{subContent}</span>
      </div>
    )}

    <button
      type="button"
      className="button button-fill button-large w-full border border-theme-gray-light rounded-full text-sm text-theme-black text-font-bold bg-theme-gray-light m-auto"
      onClick={() => setSheetOpened(false)}
    >
      {btnText}
    </button>
  </Sheet>
);

export default React.memo(SheetAlert);
