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
          window.onerror = function(msg, src, line, col, err) {
              if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'jsError',
                      message: msg,
                      source: src,
                      line: line
                  }));
              }
          };
      </script>
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false"
          onload="window.kakaoLoaded = true;"
          onerror="(function(){
              window.kakaoError = true;
              if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'kakaoLoadError',
                      reason: 'script_load_failed'
                  }));
              }
          })();"></script>
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
          .store-marker-wrap {
              display: flex;
              flex-direction: column;
              align-items: center;
              cursor: pointer;
              user-select: none;
          }
          .store-badge {
              display: flex;
              align-items: center;
              background: white;
              border-radius: 20px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.3);
              overflow: hidden;
              white-space: nowrap;
          }
          .store-icon-circle {
              width: 26px;
              height: 26px;
              background: #1C4BC8;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 3px 2px 3px 3px;
              flex-shrink: 0;
              color: white;
          }
          .store-rating-text {
              color: #222;
              font-size: 11px;
              font-weight: 700;
              padding: 0 8px 0 4px;
              line-height: 1;
          }
          .store-badge-arrow {
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 5px solid white;
              filter: drop-shadow(0 1px 1px rgba(0,0,0,0.15));
          }
          .store-marker-wrap--highlighted .store-badge {
              background: #EF7810;
          }
          .store-marker-wrap--highlighted .store-icon-circle {
              background: white;
              color: #EF7810;
          }
          .store-marker-wrap--highlighted .store-rating-text {
              color: white;
              font-size: 12px;
          }
          .store-marker-wrap--highlighted .store-badge-arrow {
              border-top-color: #EF7810;
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
          let lastMarkerClickTime = 0; // 마커 클릭 시각 (맵 click 이벤트 중복 방지)
          let isReady = false;
          let initInProgress = false;
          let kakaoWaitTimeout = null;
          let kakaoWaitMaxAttempts = 100; // 최대 10초 대기 (100 * 100ms)
          let kakaoWaitAttempts = 0;
          
          // Kakao SDK 로딩 확인 함수 (스크립트 onload/onerror 이후 호출)
          function waitForKakao() {
              if (window.kakaoError) {
                  if (window.ReactNativeWebView) {
                      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'kakaoLoadError', reason: 'script_load_failed' }));
                  }
                  return;
              }
              
              if (!window.kakaoLoaded || typeof kakao === 'undefined') {
                  kakaoWaitAttempts++;
                  if (kakaoWaitAttempts >= kakaoWaitMaxAttempts) {
                      if (window.ReactNativeWebView) {
                          window.ReactNativeWebView.postMessage(JSON.stringify({ 
                              type: 'kakaoLoadError',
                              reason: 'timeout'
                          }));
                      }
                      return;
                  }
                  if (kakaoWaitTimeout) clearTimeout(kakaoWaitTimeout);
                  kakaoWaitTimeout = setTimeout(waitForKakao, 100);
                  return;
              }
              
              // autoload=false이므로 kakao.maps.load()로 비동기 초기화
              kakao.maps.load(function() {
                  if (window.ReactNativeWebView) {
                      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'kakaoLoaded' }));
                  }
              });
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
                          if (typeof kakao === 'undefined' || !kakao.maps) {
                              window.ReactNativeWebView.postMessage(JSON.stringify({
                                  type: 'kakaoLoadError',
                                  reason: 'kakao_not_ready'
                              }));
                              return;
                          }
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
                  case 'panBy':
                      // 지도를 픽셀 단위로 pan (패널 높이 보정)
                      map.panBy(data.dx, data.dy);
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
                  // 마커 클릭 직후 300ms 이내면 무시 (마커 클릭이 맵 click으로 전파되는 현상 방지)
                  if (Date.now() - lastMarkerClickTime < 300) return;
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
              const imageSize = new kakao.maps.Size(22, 34);
              const imageOption = { offset: new kakao.maps.Point(11, 34) };
              return new kakao.maps.MarkerImage(
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 34"><path d="M11 0C4.92 0 0 4.92 0 11c0 8.5 11 23 11 23s11-14.5 11-23C22 4.92 17.08 0 11 0z" fill="%23EF7810"/><circle cx="11" cy="11" r="4" fill="white"/></svg>',
                  imageSize,
                  imageOption
              );
          }


          function createClickedIcon() {
              const imageSize = new kakao.maps.Size(26, 40);
              const imageOption = { offset: new kakao.maps.Point(13, 40) };
              return new kakao.maps.MarkerImage(
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 40"><path d="M13 0C5.82 0 0 5.82 0 13c0 10 13 27 13 27s13-17 13-27C26 5.82 20.18 0 13 0z" fill="%2327AE60"/><circle cx="13" cy="13" r="5" fill="white"/></svg>',
                  imageSize,
                  imageOption
              );
          }

          function addStoreMarker(store) {
              var position = new kakao.maps.LatLng(store.latitude, store.longitude);

              var wrapEl = document.createElement('div');
              wrapEl.className = 'store-marker-wrap';

              var badgeEl = document.createElement('div');
              badgeEl.className = 'store-badge';
              badgeEl.innerHTML =
                  '<div class="store-icon-circle">'
                  + '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>'
                  + '</div>'
                  + '<span class="store-rating-text">' + (store.reviewAvg != null ? Number(store.reviewAvg).toFixed(1) : '-') + '</span>';

              var arrowEl = document.createElement('div');
              arrowEl.className = 'store-badge-arrow';

              wrapEl.appendChild(badgeEl);
              wrapEl.appendChild(arrowEl);

              wrapEl.addEventListener('click', function(e) {
                  e.stopPropagation();
                  e.preventDefault();
                  lastMarkerClickTime = Date.now();
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'storeSelected', store: store }));
              });

              var overlay = new kakao.maps.CustomOverlay({
                  position: position,
                  content: wrapEl,
                  yAnchor: 1,
                  zIndex: 3
              });
              overlay.setMap(map);

              markers.push(overlay);
              markerMap[store.id] = { marker: overlay, store: store, el: wrapEl };
          }

          function highlightStoreMarker(storeId) {
              // 이전에 강조된 마커 원래대로 복원
              if (highlightedMarkerId && markerMap[highlightedMarkerId]) {
                  markerMap[highlightedMarkerId].el.className = 'store-marker-wrap';
              }

              // 새로운 마커 강조
              if (markerMap[storeId]) {
                  markerMap[storeId].el.className = 'store-marker-wrap store-marker-wrap--highlighted';
                  highlightedMarkerId = storeId;
              }
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
