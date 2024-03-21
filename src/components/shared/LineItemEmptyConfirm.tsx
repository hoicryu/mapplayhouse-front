import React from 'react';
import { f7, Sheet } from 'framework7-react';

import { useRecoilState, useRecoilValue } from 'recoil';
import { currentMarketId, LineItemMarketId } from '@atoms';
import useLineItemMutations from '@hooks/useLineItemMutations';

interface SheetConfirmProps {
  sheetOpened: boolean;
  emptyConfirmOpen: any;
  setSheetOpened: React.Dispatch<React.SetStateAction<object>>;
  content?: any;
  cancelText: string;
  confirmText: string;
  confirmCallback: any;
}
const LineItemEmptyConfirm = ({
  sheetOpened,
  emptyConfirmOpen,
  setSheetOpened,
  content,
  cancelText,
  confirmText,
  confirmCallback,
}: SheetConfirmProps) => {
  const MarketId = useRecoilValue<number>(currentMarketId);
  const [lineItemMarketId, setLineItemMarketId] = useRecoilState<number>(LineItemMarketId);
  const { deleteCartMutation, addCartMutateFtn } = useLineItemMutations();

  const sheetStyle = () => {
    const style = {
      left: '50%',
      transform: 'translate(-50%, 0%)',
    };
    if (!sheetOpened) style['display'] = 'none';
    return style;
  };

  const emptyFillCart = () => {
    deleteCartMutation.mutate();
    addCartMutateFtn(emptyConfirmOpen.marketItemId, emptyConfirmOpen.quantity);
    setLineItemMarketId(MarketId);
    setSheetOpened({ ...emptyConfirmOpen, open: false });
    setTimeout(() => confirmCallback(true), 500);
  };

  return (
    <Sheet
      backdrop
      opened={sheetOpened}
      onSheetClosed={() => {
        setSheetOpened({ ...emptyConfirmOpen, open: false });
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
          onClick={() => setSheetOpened({ ...emptyConfirmOpen, open: false })}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className="button button-fill button-large w-full border border-theme-gray-light rounded-full text-sm text-theme-black text-font-bold bg-theme-gray-light m-auto"
          onClick={emptyFillCart}
        >
          {confirmText}
        </button>
      </div>
    </Sheet>
  );
};

export default React.memo(LineItemEmptyConfirm);
