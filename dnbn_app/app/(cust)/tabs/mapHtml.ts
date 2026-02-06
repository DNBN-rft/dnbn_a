export const generateMapHTML = (appKey: string) => `
  <!DOCTYPE html>
  <html lang="ko">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Kakao Map</title>
      <script>
          // React Native 메시지 리스너를 가장 먼저 등록
          window.messageQueue = [];
          window.addEventListener('message', function(event) {
              let data;
              try {
                  data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
              } catch (e) {
                  return;
              }
              
              window.messageQueue.push(data);
          });
          
          window.kakaoLoaded = false;
          window.kakaoError = false;
      </script>
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}" onload="window.kakaoLoaded = true;" onerror="window.kakaoError = true;"></script>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          html, body {
              width: 100%;
              height: 100%;
              font-family: Arial, sans-serif;
              overflow: hidden;
          }
          body {
              width: 100%;
              height: 100%;
          }
          #map {
              width: 100%;
              height: 100%;
          }
          .info-window {
              padding: 12px;
              background-color: white;
              border-radius: 8px;
              font-size: 14px;
          }
          .store-name {
              font-weight: bold;
              color: #333;
              margin-bottom: 4px;
          }
          .store-info {
              color: #666;
              font-size: 12px;
          }
      </style>
  </head>
  <body>
      <div id="map"></div>
      
      <script>
          let map;
          let markers = [];
          let markerMap = {}; // 가맹점 ID와 마커를 매핑
          let userLocationMarker = null;
          let clickedMarker = null;
          let highlightedMarkerId = null; // 현재 강조된 마커의 ID
          let isReady = false;
          let initInProgress = false;
          let kakaoWaitTimeout = null;
          let kakaoWaitMaxAttempts = 100; // 최대 10초 대기 (100 * 100ms)
          let kakaoWaitAttempts = 0;
          
          // Kakao SDK 로딩 확인 함수
          function waitForKakao() {
              if (window.kakaoError) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'kakaoLoadError' }));
                  return;
              }
              
              if (typeof kakao === 'undefined' || !kakao.maps) {
                  kakaoWaitAttempts++;
                  
                  // 최대 대기 시간 초과
                  if (kakaoWaitAttempts >= kakaoWaitMaxAttempts) {
                      window.ReactNativeWebView.postMessage(JSON.stringify({ 
                          type: 'kakaoLoadError',
                          reason: 'timeout'
                      }));
                      return;
                  }
                  
                  if (kakaoWaitTimeout) clearTimeout(kakaoWaitTimeout);
                  kakaoWaitTimeout = setTimeout(waitForKakao, 100);
                  return;
              }
              
              // Kakao SDK 로드 완료
              if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'kakaoLoaded' }));
              }
          }
          
          // SDK 로딩 시작
          waitForKakao();

          // 메시지 처리 함수 (전역으로 노출)
          window.handleMessage = function(data) {
              if (!isReady && data.type !== 'init') {
                  return;
              }
              
              switch(data.type) {
                  case 'init':
                      try {
                          initMap();
                      } catch (e) {
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                              type: 'kakaoLoadError',
                              reason: 'init_error',
                              message: e.toString()
                          }));
                      }
                      break;
                  case 'userLocation':
                      displayUserLocation(data.latitude, data.longitude);
                      break;
                  case 'userLocationWithZoom':
                      displayUserLocation(data.latitude, data.longitude);
                      map.setLevel(data.zoom);
                      setTimeout(() => {
                          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
                      }, 1000);
                      break;
                  case 'mapNavigation':
                      // 지도 이동만 (마커 생성 없음)
                      map.setCenter(new kakao.maps.LatLng(data.latitude, data.longitude));
                      map.setLevel(data.zoom);
                      break;
                  case 'addStores':
                      clearMarkers();
                      data.stores.forEach(store => addStoreMarker(store));
                      break;
                  case 'clearMarkers':
                      clearMarkers();
                      break;
                  case 'clearAllMarkers':
                      clearAllMarkers();
                      break;
                  case 'highlightStore':
                      highlightStoreMarker(data.storeId);
                      break;
              }
          };
          
          // 메시지 큐 처리 (postMessage 방식을 위한 폴백)
          let messageProcessInterval = setInterval(function() {
              if (window.messageQueue && window.messageQueue.length > 0) {
                  const msg = window.messageQueue.shift();
                  window.handleMessage(msg);
              }
          }, 10);
          

          function initMap() {
              try {
                  if (initInProgress) return;
                  initInProgress = true;
                  
                  const container = document.getElementById('map');
                  if (!container) {
                      window.ReactNativeWebView.postMessage(JSON.stringify({ 
                          type: 'kakaoLoadError',
                          reason: 'container_not_found'
                      }));
                      return;
                  }
                  
                  const options = {
                      center: new kakao.maps.LatLng(37.4979, 127.0276),
                      level: 5
                  };
                  map = new kakao.maps.Map(container, options);
              
              // 줌 변화 이벤트 리스너 - 자연스러운 타일 리로드
              let zoomTimeout;
              kakao.maps.event.addListener(map, 'zoom_changed', function() {
                  clearTimeout(zoomTimeout);
                  
                  const center = map.getCenter();
                  const currentLat = center.getLat();
                  const currentLng = center.getLng();
                  
                  const randomLat = (Math.random() - 0.5) * 0.0000005; // ±0.00000025도
                  const randomLng = (Math.random() - 0.5) * 0.0000005;
                  
                  map.setCenter(new kakao.maps.LatLng(
                      currentLat + randomLat,
                      currentLng + randomLng
                  ));
                  
                  zoomTimeout = setTimeout(() => {
                      map.setCenter(center);
                  }, 50);
              });
              
              // 지도 클릭 이벤트 리스너
              kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
                  const latlng = mouseEvent.latLng;
                  const lat = latlng.getLat();
                  const lng = latlng.getLng();
                  
                  // 이전 클릭 마커 제거
                  if (clickedMarker) {
                      clickedMarker.setMap(null);
                      clickedMarker = null;
                  }
                  
                  // 현재위치 마커 제거
                  if (userLocationMarker) {
                      userLocationMarker.setMap(null);
                      userLocationMarker = null;
                  }
                  
                  // 새 클릭 마커 추가
                  clickedMarker = new kakao.maps.Marker({
                      position: new kakao.maps.LatLng(lat, lng),
                      map: map,
                      image: createClickedIcon(),
                      title: '선택한 위치'
                  });
                  
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'mapClicked',
                      latitude: lat,
                      longitude: lng
                  }));
              });
              
              isReady = true;
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
              } catch (error) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ 
                      type: 'kakaoLoadError',
                      reason: 'init_map_error',
                      error: error.toString()
                  }));
              }
          }

          function displayUserLocation(lat, lng) {
              if (userLocationMarker) {
                  userLocationMarker.setMap(null);
              }

              const userPosition = new kakao.maps.LatLng(lat, lng);
              
              userLocationMarker = new kakao.maps.Marker({
                  position: userPosition,
                  map: map,
                  image: createUserIcon(),
                  title: '내 위치'
              });

              map.setCenter(userPosition); 
          }

          function createUserIcon() {
              const imageSize = new kakao.maps.Size(32, 40);
              const imageOption = { offset: new kakao.maps.Point(16, 40) };
              return new kakao.maps.MarkerImage(
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40"><path d="M16 0C8.27 0 2 6.27 2 14c0 12 14 26 14 26s14-14 14-26c0-7.73-6.27-14-14-14z" fill="%23EF7810"/><circle cx="16" cy="14" r="5" fill="white"/></svg>',
                  imageSize,
                  imageOption
              );
          }

          function createStoreIcon() {
              const imageSize = new kakao.maps.Size(40, 45);
              const imageOption = { offset: new kakao.maps.Point(20, 45) };
              return new kakao.maps.MarkerImage(
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 45"><path d="M20 0C9.06 0 0 9.06 0 20c0 13 20 25 20 25s20-12 20-25c0-10.94-9.06-20-20-20z" fill="%23FF6B6B"/><circle cx="20" cy="20" r="8" fill="white"/></svg>',
                  imageSize,
                  imageOption
              );
          }

          function createClickedIcon() {
              const imageSize = new kakao.maps.Size(40, 45);
              const imageOption = { offset: new kakao.maps.Point(20, 45) };
              return new kakao.maps.MarkerImage(
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 45"><path d="M20 0C9.06 0 0 9.06 0 20c0 13 20 25 20 25s20-12 20-25c0-10.94-9.06-20-20-20z" fill="%23EF7810" opacity="0.8"/><circle cx="20" cy="20" r="8" fill="white"/></svg>',
                  imageSize,
                  imageOption
              );
          }

          function addStoreMarker(store) {
              const position = new kakao.maps.LatLng(store.latitude, store.longitude);
              
              const marker = new kakao.maps.Marker({
                  position: position,
                  map: map,
                  image: createStoreIcon(),
                  title: store.name
              });

              marker.addListener('click', function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'storeSelected', store: store }));
              });

              markers.push(marker);
              markerMap[store.id] = { marker: marker, store: store }; // 마커 저장
          }

          function highlightStoreMarker(storeId) {
              // 이전에 강조된 마커 원래대로 복원
              if (highlightedMarkerId && markerMap[highlightedMarkerId]) {
                  markerMap[highlightedMarkerId].marker.setImage(createStoreIcon());
              }
              
              // 새로운 마커 강조
              if (markerMap[storeId]) {
                  markerMap[storeId].marker.setImage(createHighlightedStoreIcon());
                  highlightedMarkerId = storeId;
              }
          }

          function createHighlightedStoreIcon() {
              const imageSize = new kakao.maps.Size(48, 54);
              const imageOption = { offset: new kakao.maps.Point(24, 54) };
              return new kakao.maps.MarkerImage(
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 54"><path d="M24 0C10.7 0 0 10.7 0 24c0 15.6 24 30 24 30s24-14.4 24-30c0-13.3-10.7-24-24-24z" fill="%23EF7810"/><circle cx="24" cy="24" r="10" fill="white"/><circle cx="24" cy="24" r="8" fill="%23EF7810" opacity="0.3"/></svg>',
                  imageSize,
                  imageOption
              );
          }

          function clearMarkers() {
              markers.forEach(marker => marker.setMap(null));
              markers = [];
              markerMap = {};
              highlightedMarkerId = null;
          }

          function clearAllMarkers() {
              markers.forEach(marker => marker.setMap(null));
              markers = [];
              // 클릭 마커도 제거
              if (clickedMarker) {
                  clickedMarker.setMap(null);
                  clickedMarker = null;
              }
          }

          // 초기화는 React Native에서 onLoadEnd 이벤트로 처리
      </script>
  </body>
  </html>
`;
