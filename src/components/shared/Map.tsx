import React, { useState, useEffect, useRef } from 'react';
import { f7, PageContent, Sheet } from 'framework7-react';
import { Market, PageRouteProps } from '@constants';
import { currentMarketId, userLikes, userLatitude, userLongitude } from '@atoms';
import { useMutation, useQueryClient } from 'react-query';
import { getLikes, updateMarketId } from '@api';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { groupBy } from 'lodash';
import { IS_PRODUCTION } from '@config';
import useAuth from '@hooks/useAuth';
import aroundImg from '@assets/icons/around_marker.png';
import targetImg from '@assets/icons/target_marker.png';
import currentLocation from '@assets/icons/current_location.png';
import findMyLocation from '@assets/icons/find_my_location.png';
import reload from '@assets/icons/reload.png';
import MarketCard from './MarketCard';
import CommonHr from './CommonHr';
import SheetAlert from './SheetAlert';

const SortStates = [
  ['distance desc', '거리순'],
  ['likes_count desc', '찜콩순'],
] as const;
interface MapProps extends PageRouteProps {
  markets: Market[];
  inputContent: string;
  onChangeInput: any;
  onChangeSort: any;
  setMapLatitude: any;
  setMapLongitude: any;
}

const Map = ({
  markets,
  inputContent,
  onChangeInput,
  setMapLatitude,
  setMapLongitude,
  onChangeSort,
  f7route,
  f7router,
}: MapProps) => {
  const [sheetOpened, setSheetOpened] = useState<boolean>(false);
  const [singleCardOpened, setSingleCardOpened] = useState<boolean>(false);
  const [alertSheetOpened, setAlertSheetOpened] = useState<boolean>(false);
  const [alertSheetContent, setAlertSheetContent] = useState<string>('');

  const [currentMarket, setCurrentMarket] = useState<Market>();
  const setMarketId = useSetRecoilState<number>(currentMarketId);
  const [marketSort, setMarketSort] = useState<string>('거리순');
  const [currentMarker, setCurrentMarker] = useState(); // 현재 사용자 위치 마커
  const queryClient = useQueryClient();
  const setUserLikes = useSetRecoilState(userLikes);
  const overlayRef = useRef(null);
  const inputRef = useRef(null);
  const kakaoMapRef = useRef(null);
  const [currentLatitude, setCurrentLatitude] = useRecoilState<number>(userLatitude); // 현재 사용자 위도
  const [currentLongitude, setCurrentLongitude] = useRecoilState<number>(userLongitude); // 현재 사용자 경도
  const { isAuthenticated, authenticateUser } = useAuth();
  const [allMarkers, setAllMarkers] = useState([]);

  const smallImageSize = new window.kakao.maps.Size(32, 35); // 작은 마커이미지의 크기입니다
  const bigImageSize = new window.kakao.maps.Size(48, 52); // 큰 마커이미지의 크기입니다
  const currentImageSize = new window.kakao.maps.Size(48, 48); // 현재위치 마커이미지의 크기입니다
  // const imageOption = { offset: new window.kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
  const bigImageOption = { offset: new window.kakao.maps.Point(24, 50) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
  const smallImageOption = { offset: new window.kakao.maps.Point(16, 35) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

  const targetMarkerImage = new window.kakao.maps.MarkerImage(targetImg, bigImageSize, bigImageOption);
  const aroundMarkerImage = new window.kakao.maps.MarkerImage(aroundImg, smallImageSize, smallImageOption);
  const currentMarkerImage = new window.kakao.maps.MarkerImage(currentLocation, currentImageSize, bigImageOption);

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        await queryClient.prefetchQuery('likes', getLikes());
        await setUserLikes(groupBy(queryClient.getQueryData('likes'), 'target_type'));
      }
    })();
  }, []);

  const UpdateMarketId = useMutation(updateMarketId(), {
    onError: () => {
      setAlertSheetContent('에러가 발생했습니다');
      setAlertSheetOpened(true);
    },
  });

  const onClickMarket = (id: number) => {
    f7.dialog.preloader('잠시만 기다려주세요...');
    UpdateMarketId.mutate(
      { market_id: id },
      {
        onSuccess: (res) => {
          setSheetOpened(false);
          setSingleCardOpened(false);
          const { result, market_id, signed_in, token, csrf } = res;
          if (isAuthenticated) authenticateUser({ token, csrf });
          if (result || !signed_in) {
            f7.dialog.close();
            setMarketId(parseInt(market_id, 10));
          } else {
            f7.dialog.close();
            setAlertSheetContent('에러가 발생했습니다');
            setAlertSheetOpened(true);
          }
        },
      },
    );
  };

  // 로그아웃 상태로 클릭 이벤트 발생 시
  const onClickLogoutMarket = (id: number) => {
    setSheetOpened(false);
    setSingleCardOpened(false);
  };

  const customOverLay = (market) => `
    <div class="border border-black rounded-full px-3 py-1 bg-white absolute left-6" style="bottom: 50%">
      ${market.name}
    </div>
  `;

  // 지도 부드럽게 이동
  const panTo = (map, lat, lng) => {
    // lat, lng 는 각각 클릭한 마커의 위도 경도
    // 이동할 위도 경도 위치를 생성합니다
    const moveLatLon = new window.kakao.maps.LatLng(lat, lng);

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
  };

  // 마커 클릭 시 이벤트
  const addMarkerEvent = (map, marker, market: Market, overlay) => {
    // 마커 클릭 시 sheet open, 해당 좌표로 부드럽게 이동

    window.kakao.maps.event.addListener(marker, 'click', async () => {
      if (overlayRef.current) await overlayRef.current.setMap(null);
      panTo(map, market.lat, market.lng);
      allMarkers.forEach((mk) => mk.setImage(aroundMarkerImage));
      marker.setImage(targetMarkerImage);
      setSingleCardOpened(true);
      setCurrentMarket(market);
      overlay.setMap(map);
      overlayRef.current = overlay;
      inputRef.current.blur();
    });
    // 마커가 아닌 지도 클릭 시 sheet close
    window.kakao.maps.event.addListener(map, 'click', () => {
      marker.setImage(aroundMarkerImage);
      setSheetOpened(false);
      setSingleCardOpened(false);
      if (overlayRef.current) overlayRef.current.setMap(null);
      inputRef.current.blur();
    });
    window.kakao.maps.event.addListener(map, 'dragstart', () => {
      setSheetOpened(false);
      inputRef.current.blur();
    });
  };

  // 지도에 마커 표시
  const mapMarkers = (map) => {
    // lat, lng는 현재 위치 주변 마켓의 위도 경도
    if (markets) {
      markets.map((market: Market) => {
        const marketPosition = new window.kakao.maps.LatLng(market.lat, market.lng);
        const marker = new window.kakao.maps.Marker({
          map,
          position: marketPosition,
          image: currentMarket?.id === market.id ? targetMarkerImage : aroundMarkerImage,
        });
        setAllMarkers((value) => [...value, marker]);
        const overlay = new window.kakao.maps.CustomOverlay({
          map,
          position: marketPosition,
          content: customOverLay(market),
        });

        overlay.setMap(null);
        addMarkerEvent(map, marker, market, overlay);
      });
    }
  };

  const removeMapMarkers = () => {
    if (allMarkers) {
      allMarkers.map((marker) => marker.setMap(null));
      setAllMarkers([]);
    }
  };

  // 카카오 맵 설정
  const setKaKaoMap = async (lat, lng) => {
    const container = document.getElementById('kakao_map');
    const currentPosition = new window.kakao.maps.LatLng(lat, lng);
    const options = {
      center: currentPosition,
      level: 5,
      scrollwheel: true,
    };

    await f7.dialog.close();
    const map = new window.kakao.maps.Map(container, options);
    kakaoMapRef.current = map;

    const marker = new window.kakao.maps.Marker({
      map,
      position: currentPosition,
      image: currentMarkerImage,
    });

    mapMarkers(map);
    setCurrentMarker(marker);
  };

  // 카카오 맵 보여주기
  useEffect(() => {
    f7.dialog.preloader('현재 위치를 찾는 중입니다.');
    if (!!navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLatitude(latitude);
        setCurrentLongitude(longitude);
      });
    } else {
      f7.dialog.close();
      f7.dialog.alert('현재 위치를 조회할 수 없습니다, 설정을 변경 후 시도해주세요.');
    }
    f7.dialog.close();
  }, []);

  useEffect(() => {
    setKaKaoMap(currentLatitude, currentLongitude);
  }, [currentLatitude, currentLongitude]);

  useEffect(() => {
    if (kakaoMapRef.current) {
      mapMarkers(kakaoMapRef.current);
    }
  }, [markets]);

  const onClickRelaod = async () => {
    await removeMapMarkers();
    const getMapCenter = kakaoMapRef.current.getCenter();
    await setMapLatitude(getMapCenter.Ma);
    await setMapLongitude(getMapCenter.La);
  };

  const onClickCurrentPosition = () => {
    if (currentMarker) currentMarker.setMap(null); // 현재 마커 제거

    f7.dialog.preloader('현재 위치를 찾는 중입니다.');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setCurrentLatitude(lat);
        setCurrentLongitude(lng);
        f7.dialog.close();
        kakaoMapRef.current.setCenter(new window.kakao.maps.LatLng(lat, lng));
        const marker = new window.kakao.maps.Marker({
          kakaoMapRef,
          position: new window.kakao.maps.LatLng(lat, lng),
          image: currentMarkerImage,
        });
        marker.setMap(kakaoMapRef.current);
        setCurrentMarker(marker);
      });
    } else {
      f7.dialog.close();
      setAlertSheetContent('현재 위치를 조회할 수 없습니다, 설정을 변경 후 시도해주세요.');
      setAlertSheetOpened(true);
    }
  };

  return (
    <>
      <SheetAlert
        sheetOpened={alertSheetOpened}
        setSheetOpened={setAlertSheetOpened}
        content={alertSheetContent}
        btnText="닫기"
      />
      <div className="absolute z-50 top-8 w-full">
        <input
          type="text"
          className="w-5/6 p-1 text-xs border-2 border-theme-blue"
          placeholder="내 주변 마트 또는 슈퍼를 검색하세요"
          autoComplete="off"
          value={inputContent}
          onChange={(e) => {
            setSingleCardOpened(false);
            setSheetOpened(true);
            onChangeInput(e);
          }}
          onClick={() => {
            setSheetOpened(true);
            setSingleCardOpened(false);
          }}
          ref={inputRef}
          style={{
            backgroundColor: 'white',
            margin: 'auto',
            padding: '0.75rem',
            borderRadius: '25px',
            boxShadow: 'grey 3px 3px 10px -1px',
            border: '2px #0DACFF solid',
          }}
        />
      </div>
      <div id="kakao_map" className="w-full h-full" />
      <Sheet
        onSheetClosed={() => setSheetOpened(false)}
        className="h-2/3 rounded-t-3xl shadow-2xl map-modal-sheet"
        style={{ backgroundColor: '#ffffffde' }}
        opened={sheetOpened}
        swipeToClose
      >
        <CommonHr hrClassName="w-16 m-auto text-center mt-3" />
        <div className="flex justify-between text-xs pt-5 pb-2 px-2">
          <div className="grid grid-cols-2 gap-2 ml-3">
            {SortStates.map((v, idx) => (
              <a
                href="#"
                key={idx}
                className={`link col-span-1 ${marketSort === v[1] ? 'text-theme-blue' : 'text-theme-gray'}`}
                onClick={() => {
                  onChangeSort(v);
                  setMarketSort(v[1]);
                }}
              >
                {v[1]}
              </a>
            ))}
          </div>
        </div>

        <PageContent>
          <article className="px-3 overflow-scroll h-full pt-2 pb-8" style={{ zIndex: 13000 }}>
            {markets &&
              markets.map((market: Market) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  onClickMarket={onClickMarket}
                  onClickLogoutMarket={onClickLogoutMarket}
                  f7route={f7route}
                  f7router={f7router}
                />
              ))}
          </article>
        </PageContent>
      </Sheet>
      <Sheet
        onSheetClosed={() => setSingleCardOpened(false)}
        className="pt-6 px-3 map-modal-sheet absolute"
        opened={singleCardOpened}
        style={{ height: 'auto', background: 'none' }}
        swipeToClose
      >
        {currentMarket && (
          <MarketCard
            key={currentMarket.id}
            market={currentMarket}
            onClickMarket={onClickMarket}
            onClickLogoutMarket={onClickLogoutMarket}
            f7route={f7route}
            f7router={f7router}
          />
        )}
      </Sheet>
      <div className="bg-white absolute top-24 right-4 z-10 rounded-lg shadow-lg ">
        <a href="#" onClick={onClickRelaod}>
          <img src={reload} alt="" className="link w-12 h-12" />
        </a>
      </div>
      <div className="bg-white absolute top-40 right-4 z-10 rounded-lg shadow-lg ">
        <a href="#" onClick={onClickCurrentPosition}>
          <img src={findMyLocation} alt="" className="link w-12 h-12" />
        </a>
      </div>
    </>
  );
};

export default React.memo(Map);
