import Framework7 from 'framework7';
import { f7 } from 'framework7-react';
import { last } from 'lodash';

const nativeConfig = {
  f7: {} as Framework7,
  checkCurrentPath(keepCurrentPath: boolean) {
    if (keepCurrentPath) {
      // window.history.pushState('forward', '', `/#${last(f7.views.current.history)}`);
      window.history.pushState('forward', '');
    }
  },
  handleAndroidBackButton() {
    window.addEventListener('popstate', () => {
      let keepCurrentPath = true;
      if (window.history && !!window.history.pushState) {
        if (f7.panel.get('.panel')?.opened) {
          f7.panel.close();
        } else if (f7.dialog.get('.dialog')?.opened) {
          f7.dialog.close();
        } else if (f7.popup.get('.popup')?.opened) {
          f7.popup.close();
        } else if (f7.sheet.get('.sheet-modal')?.opened) {
          f7.sheet.close();
        } else if (f7.actions.get('.actions-modal')?.opened) {
          f7.actions.close();
        } else {
          keepCurrentPath = false;
          f7.views.current.router.back();
        }
        nativeConfig.checkCurrentPath(keepCurrentPath);
      }
    });
  },
  init(f7: Framework7) {
    nativeConfig.f7 = f7;
    nativeConfig.handleAndroidBackButton();
  },
};

export default nativeConfig;
