import React, { memo, useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import type { SuggestedMandi } from "./FarmerDashboard";

interface FindMandiMapProps {
  mandis: SuggestedMandi[];
  selectedMandiId: string | null;
  onSelectMandi: (mandi: SuggestedMandi) => void;
}

// Leaflet is loaded via CDN to avoid adding npm dependencies
const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

function loadLeaflet(): Promise<any> {
  if ((window as any).L) return Promise.resolve((window as any).L);

  return new Promise((resolve, reject) => {
    // Load CSS
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    // Load JS
    if (!document.querySelector(`script[src="${LEAFLET_JS}"]`)) {
      const script = document.createElement("script");
      script.src = LEAFLET_JS;
      script.onload = () => resolve((window as any).L);
      script.onerror = reject;
      document.head.appendChild(script);
    } else {
      // Script tag exists but may still be loading
      const check = setInterval(() => {
        if ((window as any).L) {
          clearInterval(check);
          resolve((window as any).L);
        }
      }, 50);
      setTimeout(() => { clearInterval(check); reject(new Error("Leaflet load timeout")); }, 10000);
    }
  });
}

export const FindMandiMap = memo(function FindMandiMap({
  mandis,
  selectedMandiId,
  onSelectMandi,
}: FindMandiMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  // Center of MP / Indore area
  const center: [number, number] = [22.9, 75.6];

  useEffect(() => {
    let cancelled = false;

    loadLeaflet().then((L) => {
      if (cancelled || !mapContainerRef.current) return;

      // If map already exists, skip init
      if (mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 8,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;

      // Add markers
      const defaultIcon = L.divIcon({
        html: `<div style="width:24px;height:24px;background:#059669;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const selectedIcon = L.divIcon({
        html: `<div style="width:30px;height:30px;background:#0B2D1B;border:3px solid #C8F52F;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      mandis.forEach((mandi) => {
        const isSelected = mandi.id === selectedMandiId;
        const marker = L.marker([mandi.lat, mandi.lng], {
          icon: isSelected ? selectedIcon : defaultIcon,
        }).addTo(map);

        marker.bindPopup(
          `<div style="font-family:system-ui;min-width:160px;">` +
          `<div style="font-weight:700;font-size:13px;color:#0B2D1B;margin-bottom:4px;">${mandi.name}</div>` +
          `<div style="font-size:11px;color:#5A6C5F;">${mandi.badge ? mandi.badge : ""}</div>` +
          `</div>`,
          { closeButton: false, offset: [0, -8] }
        );

        marker.on("click", () => onSelectMandi(mandi));
        markersRef.current.set(mandi.id, marker);
      });

      // Fix map size after render
      setTimeout(() => map.invalidateSize(), 200);
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker icons when selection changes
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    const defaultIcon = L.divIcon({
      html: `<div style="width:24px;height:24px;background:#059669;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
      className: "",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const selectedIcon = L.divIcon({
      html: `<div style="width:30px;height:30px;background:#0B2D1B;border:3px solid #C8F52F;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
      className: "",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    markersRef.current.forEach((marker, id) => {
      marker.setIcon(id === selectedMandiId ? selectedIcon : defaultIcon);
      if (id === selectedMandiId) {
        marker.openPopup();
      }
    });

    // Pan to selected mandi
    if (selectedMandiId) {
      const selectedMandi = mandis.find((m) => m.id === selectedMandiId);
      if (selectedMandi) {
        mapRef.current.setView([selectedMandi.lat, selectedMandi.lng], 10, { animate: true });
      }
    }
  }, [selectedMandiId, mandis]);

  const osmLink = `https://www.openstreetmap.org/#map=9/${center[0]}/${center[1]}`;

  return (
    <div className="flex flex-col rounded-2xl border border-[#E8EAEC] bg-white shadow-sm overflow-hidden">
      {/* Map header */}
      <div className="flex items-center justify-between border-b border-[#E8EAEC] px-4 py-3">
        <div>
          <h3 className="text-sm font-bold text-[#0B2D1B]">Mandi Locations</h3>
          <p className="text-[11px] text-[#5A6C5F]">View all mandis on map</p>
        </div>
        <a
          href={osmLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-[#E2E5E9] bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#059669] hover:bg-[#E8F5E9] transition-colors"
        >
          Open in OpenStreetMap
          <ExternalLink size={11} />
        </a>
      </div>

      {/* Map container */}
      <div ref={mapContainerRef} className="h-[420px] w-full lg:h-full lg:min-h-[520px]" />

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 border-t border-[#E8EAEC] px-4 py-2.5 text-[10px] text-[#5A6C5F]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
          High Slots
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
          Medium Slots
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
          Low Slots
        </div>
      </div>
    </div>
  );
});
