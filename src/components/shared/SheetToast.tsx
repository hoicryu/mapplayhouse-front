import React from 'react';
import { Sheet } from 'framework7-react';
import { sleep } from '@js/utils';

interface SheetToastProps {
  toastSheetOpened: boolean;
  setToastSheetOpened: React.Dispatch<React.SetStateAction<boolean>>;
  children: any;
}

const SheetToast = ({ toastSheetOpened, setToastSheetOpened, children }: SheetToastProps) => {
  return (
    <Sheet
      backdrop
      opened={toastSheetOpened}
      onSheetOpened={async () => {
        await sleep(1500);
        setToastSheetOpened(false);
      }}
      onSheetClosed={() => {
        setToastSheetOpened(false);
      }}
      className="rounded-2xl mb-5 h-12 py-3"
      style={{ width: '80%', margin: '0 10% 2rem 10%' }}
    >
      {children}
    </Sheet>
  );
};

export default React.memo(SheetToast);
