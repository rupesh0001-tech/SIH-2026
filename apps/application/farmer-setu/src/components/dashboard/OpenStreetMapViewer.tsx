import React, { memo, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import type { UserCoordinates, MandiItem } from '@/interfaces';

const MapWebView = WebView as any;

export type MapLabelMode = 'price' | 'name' | 'crop';

interface OpenStreetMapViewerProps {
  userCoords: UserCoordinates;
  mandis: MandiItem[];
  selectedMandiId: string | null;
  labelMode?: MapLabelMode;
  onSelectMandi: (mandi: MandiItem) => void;
  recenterTrigger: number;
}

export const OpenStreetMapViewer = memo(function OpenStreetMapViewer({
  userCoords,
  mandis,
  selectedMandiId,
  labelMode = 'price',
  onSelectMandi,
  recenterTrigger,
}: OpenStreetMapViewerProps) {
  const webViewRef = useRef<any>(null);

  // Generate self-contained OpenStreetMap + Leaflet HTML
  // Note: selectedMandiId is NOT in the dependencies so WebView NEVER reloads on selection!
  const mapHtml = useMemo(() => {
    const mandisJson = JSON.stringify(
      mandis.map((m) => ({
        id: m.id,
        name: m.name,
        district: m.district,
        lat: m.latitude,
        lng: m.longitude,
        price: m.modalPrice,
        crop: m.topCrop,
        distanceKm: m.distanceKm,
        farmers: m.activeFarmersCount,
      }))
    );

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: #e8f5e9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    
    /* User GPS Marker */
    .user-pulse-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .user-pulse-ring {
      position: absolute;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(22, 163, 74, 0.28);
      animation: pulse 2s infinite ease-out;
    }
    .user-core-dot {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #15803D;
      border: 3px solid #FFFFFF;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFF;
      font-size: 10px;
      font-weight: 800;
    }
    @keyframes pulse {
      0% { transform: scale(0.6); opacity: 1; }
      100% { transform: scale(1.4); opacity: 0; }
    }

    /* Mandi Marker (No emojis, sleek native badge) */
    .mandi-pin-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transform: translate(-50%, -100%);
    }
    .mandi-pin-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #FFFFFF;
      color: #15803D;
      border: 1.5px solid #16A34A;
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 11px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.18);
      white-space: nowrap;
      transition: all 0.2s ease;
      max-width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mandi-pin-badge.selected {
      background: #16A34A;
      color: #FFFFFF;
      border-color: #15803D;
      transform: scale(1.15);
      box-shadow: 0 4px 12px rgba(22, 163, 74, 0.45);
      z-index: 1000;
    }
    .mandi-pin-stem {
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 6px solid #16A34A;
      margin-top: -1px;
    }
    .mandi-pin-badge.selected + .mandi-pin-stem {
      border-top-color: #15803D;
    }
    .mandi-pin-shadow {
      width: 8px;
      height: 4px;
      background: rgba(0,0,0,0.25);
      border-radius: 50%;
      margin-top: 1px;
    }

    .leaflet-control-attribution {
      font-size: 9px !important;
      background: rgba(255,255,255,0.8) !important;
    }
    .leaflet-bar {
      border: none !important;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important;
    }
    .leaflet-bar a {
      background-color: #FFFFFF !important;
      color: #15803D !important;
      border-bottom: 1px solid #E5E7EB !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script>
    var userLat = ${userCoords.latitude};
    var userLng = ${userCoords.longitude};
    var mandis = ${mandisJson};
    var currentLabelMode = '${labelMode}';
    var selectedId = null;
    var markersMap = {};

    // 1. Initialize Map
    var map = L.map('map', {
      center: [userLat, userLng],
      zoom: 12,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // 2. User Location Marker
    var userIcon = L.divIcon({
      className: 'user-pulse-marker',
      html: '<div class="user-pulse-ring"></div><div class="user-core-dot">GPS</div>',
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });
    var userMarker = L.marker([userLat, userLng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
    userMarker.bindTooltip("<b>Farm Location</b><br/>Current GPS", { offset: [0, -12], direction: 'top' });

    // Helper to format marker label text based on mode
    function getLabelText(m) {
      if (currentLabelMode === 'name') {
        return m.name.split(' ')[0] + ' APMC';
      } else if (currentLabelMode === 'crop') {
        return m.crop ? m.crop.split(',')[0].split('&')[0].trim() : 'Crops';
      } else {
        // Price mode
        return m.price ? m.price.split(' ')[0] : 'Open';
      }
    }

    // 3. Render Mandi Markers
    function renderMarkers() {
      // Clear existing
      Object.keys(markersMap).forEach(function(k) {
        map.removeLayer(markersMap[k]);
      });
      markersMap = {};

      mandis.forEach(function(m) {
        var isSel = (m.id === selectedId);
        var label = getLabelText(m);

        var pinIcon = L.divIcon({
          className: 'custom-mandi-icon',
          html: '<div class="mandi-pin-wrap" id="pin-' + m.id + '">' +
                  '<div class="mandi-pin-badge ' + (isSel ? 'selected' : '') + '">' +
                    '<span id="txt-' + m.id + '">' + label + '</span>' +
                  '</div>' +
                  '<div class="mandi-pin-stem"></div>' +
                  '<div class="mandi-pin-shadow"></div>' +
                '</div>',
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });

        var marker = L.marker([m.lat, m.lng], { icon: pinIcon }).addTo(map);
        
        marker.on('click', function(e) {
          L.DomEvent.stopPropagation(e);
          selectMandi(m.id, true);
          sendToNative({ type: 'SELECT_MANDI', id: m.id });
        });

        markersMap[m.id] = marker;
      });
    }

    renderMarkers();

    // 4. Select and Zoom on FIRST click
    function selectMandi(id, shouldZoom) {
      selectedId = id;
      Object.keys(markersMap).forEach(function(mId) {
        var el = document.querySelector('#pin-' + mId + ' .mandi-pin-badge');
        if (el) {
          if (mId === id) {
            el.classList.add('selected');
          } else {
            el.classList.remove('selected');
          }
        }
      });

      var target = mandis.find(function(m) { return m.id === id; });
      if (target && shouldZoom !== false) {
        map.flyTo([target.lat, target.lng], 14, { duration: 0.6 });
      }
    }

    // 5. Update Label Mode
    function setLabelMode(mode) {
      currentLabelMode = mode;
      mandis.forEach(function(m) {
        var txtEl = document.getElementById('txt-' + m.id);
        if (txtEl) {
          txtEl.innerText = getLabelText(m);
        }
      });
    }

    // 6. Recenter Function
    function recenterToUser() {
      map.flyTo([userLat, userLng], 12, { duration: 0.6 });
    }

    function sendToNative(data) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      } else if (window.parent && window.parent.postMessage) {
        window.parent.postMessage(JSON.stringify(data), '*');
      }
    }

    function handleIncomingMessage(event) {
      try {
        var msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (msg.type === 'SELECT_MANDI') {
          selectMandi(msg.id, true);
        } else if (msg.type === 'SET_LABEL_MODE') {
          setLabelMode(msg.mode);
        } else if (msg.type === 'RECENTER_USER') {
          recenterToUser();
        }
      } catch (e) {}
    }

    window.addEventListener('message', handleIncomingMessage);
    document.addEventListener('message', handleIncomingMessage);
  </script>
</body>
</html>
    `;
  }, [userCoords.latitude, userCoords.longitude, mandis]);

  const handleMessage = useCallback(
    (event: any) => {
      try {
        const raw = event.nativeEvent.data;
        const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (data.type === 'SELECT_MANDI') {
          const target = mandis.find((m) => m.id === data.id);
          if (target) {
            onSelectMandi(target);
          }
        }
      } catch {}
    },
    [mandis, onSelectMandi]
  );

  // Recenter trigger effect
  useEffect(() => {
    if (recenterTrigger > 0 && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'RECENTER_USER' }));
    }
  }, [recenterTrigger]);

  // Dynamic selection change without reloading
  useEffect(() => {
    if (selectedMandiId && webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({ type: 'SELECT_MANDI', id: selectedMandiId })
      );
    }
  }, [selectedMandiId]);

  // Dynamic label mode change without reloading
  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({ type: 'SET_LABEL_MODE', mode: labelMode })
      );
    }
  }, [labelMode]);

  return (
    <View style={styles.container}>
      <MapWebView
        ref={webViewRef}
        source={{ html: mapHtml }}
        style={styles.map}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        scrollEnabled={false}
        originWhitelist={['*']}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  map: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
});
