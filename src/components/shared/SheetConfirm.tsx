import React from 'react';
import { f7, Sheet } from 'framework7-react';

interface SheetConfirmProps {
  sheetOpened: boolean;
  setSheetOpened: React.Dispatch<React.SetStateAction<boolean>>;
  content?: any;
  cancelText: string;
  confirmText: string;
  confirmCallback: any;
  center?: boolean;
}
const SheetConfirm = ({
  sheetOpened,
  setSheetOpened,
  content,
  cancelText,
  confirmText,
  confirmCallback,
  center = false,
}: SheetConfirmProps) => {
  const sheetStyle = () => {
    const style = {
      left: '50%',
      transform: 'translate(-50%, 0%)',
    };
    if (!sheetOpened) style['display'] = 'none';
    return style;
  };

  return (
    <Sheet
      backdrop
      opened={sheetOpened}
      onSheetClosed={() => {
        setSheetOpened(false);
      }}
      onSheetOpen={() => f7.preloader.hide()}
      className="rounded-2xl h-auto px-6 py-10 mb-40per w-5/6"
      style={sheetStyle()}
    >
      {content && (
        <div className="text-center text-font-bold text-sm mb-4" dangerouslySetInnerHTML={{ __html: content }}></div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="button button-fill button-large w-full border border-theme-gray-light rounded-full text-sm text-theme-black text-font-bold bg-white m-auto"
          onClick={() => setSheetOpened(false)}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className="button button-fill button-large w-full border border-theme-gray-light rounded-full text-sm text-theme-black text-font-bold bg-theme-gray-light m-auto"
          onClick={() => confirmCallback()}
        >
          {confirmText}
        </button>
      </div>
    </Sheet>
  );
};
export default React.memo(SheetConfirm);
