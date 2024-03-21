import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { f7ready, App } from 'framework7-react';
import { RecoilRoot } from 'recoil';
import { getDevice } from '@js/framework7-custom';
import { IS_PRODUCTION } from '@config';
import { RecoilRootPortal } from '@components/RecoilRootPortal';
import { toast } from '@js/utils';
import nativeConfig from '@js/nativeConfig';
import capacitorApp from '@js/capacitor-app';
import routes from '@routes';
import Views from '@components/Views';

declare global {
  interface Window {
    kakao: any;
  }
}

const F7App = () => {
  const device = getDevice();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: IS_PRODUCTION,
        refetchOnReconnect: IS_PRODUCTION,
      },
    },
  });

  const f7params = {
    name: '집마켓',
    theme: 'ios',
    id: 'com.zip-market',
    routes,
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
    view: {
      iosDynamicNavbar: device.ios,
    },
    on: {
      pageInit(page) {
        window.history.pushState('forward', '');
      },
    },
  };

  useEffect(() => {
    f7ready((f7) => {
      nativeConfig.init(f7);
      toast.set(f7);
    });
  }, []);

  if (!IS_PRODUCTION) console.log(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <App {...f7params}>
          <Views />
        </App>
        {IS_PRODUCTION ? null : <ReactQueryDevtools position="bottom-right" />}
        <RecoilRootPortal />
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default F7App;
