"use client";

import React, { useEffect, useRef, useState } from "react";
import { RankedPartnerItem, LocationInterpretation } from "@/types";
import { AlertTriangle, Compass, MapPin } from "lucide-react";

interface PartnerMapProps {
  partners: RankedPartnerItem[];
  userLocation: LocationInterpretation | null;
  selectedPartnerId?: string | null;
  onSelectPartner?: (partner: RankedPartnerItem) => void;
  className?: string;
  isHindi?: boolean;
}

export function PartnerMap({
  partners,
  userLocation,
  selectedPartnerId,
  onSelectPartner,
  className = "w-full h-80 lg:h-[500px]",
  isHindi = false,
}: PartnerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map on mount
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      try {
        const L = (await import("leaflet")).default;

        // Clean up any stale map instance
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Determine initial center
        let initLat = 20.7453;
        let initLng = 78.6022;
        let initZoom = 11;

        if (userLocation?.latitude && userLocation?.longitude) {
          initLat = userLocation.latitude;
          initLng = userLocation.longitude;
        } else if (partners.length > 0 && partners[0].latitude && partners[0].longitude) {
          initLat = partners[0].latitude;
          initLng = partners[0].longitude;
        }

        if (!mapContainerRef.current) return;
        const container = mapContainerRef.current;

        const map = L.map(container, {
          center: [initLat, initLng],
          zoom: initZoom,
          zoomControl: true,
          attributionControl: true,
          scrollWheelZoom: false, // Prevent accidental scroll capture on long pages
        });

        // Add standard OpenStreetMap tiles with required attribution
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        }).addTo(map);

        mapInstanceRef.current = map;
        if (isMounted) {
          setIsMapReady(true);
          setMapError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setMapError(err?.message || "Failed to initialize map library.");
        }
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers and bounds whenever partners or userLocation change
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || typeof window === "undefined") return;

    import("leaflet").then((LModule) => {
      const L = LModule.default;
      const map = mapInstanceRef.current;
      if (!map) return;

      // Clear existing markers
      Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
      markersRef.current = {};

      const bounds = L.latLngBounds([]);

      // 1. Plot User Location Pin
      if (userLocation?.latitude && userLocation?.longitude) {
        const userLatLng = [userLocation.latitude, userLocation.longitude] as [number, number];
        bounds.extend(userLatLng);

        const userHtml = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="width: 14px; height: 14px; background: #0B5CAD; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.35);"></div>
            <div style="position: absolute; width: 24px; height: 24px; background: rgba(11, 92, 173, 0.25); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          </div>
        `;

        const userIcon = L.divIcon({
          html: userHtml,
          className: "custom-user-pin",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        L.marker(userLatLng, { icon: userIcon, zIndexOffset: 100 })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: system-ui, sans-serif; font-size: 12px; padding: 4px;">
              <strong style="color: #0B5CAD;">${isHindi ? "आपका खोज स्थान" : "Your Search Location"}</strong>
              <div style="color: #465568; margin-top: 2px;">${userLocation.resolved_name}</div>
            </div>`
          );
      }

      // 2. Plot Partner Markers
      partners.forEach((partner) => {
        if (!partner.latitude || !partner.longitude) return;

        const pLatLng = [partner.latitude, partner.longitude] as [number, number];
        bounds.extend(pLatLng);

        const isSelected = partner.id === selectedPartnerId;
        const isTop = partner.is_top_recommended;

        // Custom styling for ranked marker
        const bgColour = isTop ? "#146C43" : isSelected ? "#084B8A" : "#0B5CAD";
        const borderColour = isSelected ? "#F59E0B" : "#FFFFFF";
        const borderWidth = isSelected ? "3px" : "2px";
        const scale = isSelected ? "scale(1.2)" : "scale(1)";
        const zIndex = isSelected ? 1000 : isTop ? 500 : 200 + (100 - partner.rank);

        const markerHtml = `
          <div style="transform: ${scale}; transition: transform 0.2s ease; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="width: 28px; height: 28px; background: ${bgColour}; color: #FFFFFF; border: ${borderWidth} solid ${borderColour}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; box-shadow: 0 3px 8px rgba(0,0,0,0.3);">
              ${partner.rank}
            </div>
            <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${bgColour}; margin-top: -1px;"></div>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: `partner-rank-pin-${partner.id}`,
          iconSize: [32, 36],
          iconAnchor: [16, 36],
          popupAnchor: [0, -36],
        });

        const marker = L.marker(pLatLng, { icon, zIndexOffset: zIndex }).addTo(map);

        // Popup content with action
        const popupContent = document.createElement("div");
        popupContent.style.fontFamily = "system-ui, sans-serif";
        popupContent.style.fontSize = "12px";
        popupContent.style.padding = "2px";
        popupContent.style.maxWidth = "240px";

        popupContent.innerHTML = `
          <div style="font-weight: 700; color: #172033; font-size: 13px; line-height: 1.3;">${partner.name}</div>
          <div style="color: #465568; font-size: 11px; margin-top: 2px;">${partner.organization_name} &bull; <strong>${partner.partner_type}</strong></div>
          <div style="color: #0B5CAD; font-weight: 700; margin-top: 4px;">~${partner.distance_km} km away</div>
          <div style="color: #69788A; font-size: 10px; margin-top: 2px;">${partner.public_address}</div>
          <button id="popup-select-${partner.id}" style="margin-top: 8px; width: 100%; background: #0B5CAD; color: #ffffff; border: none; border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: 600; cursor: pointer;">
            ${isHindi ? "यह पार्टनर चुनें" : "Select this Partner"}
          </button>
        `;

        marker.bindPopup(popupContent);

        marker.on("popupopen", () => {
          const btn = document.getElementById(`popup-select-${partner.id}`);
          if (btn) {
            btn.onclick = () => {
              if (onSelectPartner) onSelectPartner(partner);
            };
          }
        });

        marker.on("click", () => {
          if (onSelectPartner) onSelectPartner(partner);
        });

        markersRef.current[partner.id] = marker;

        // Open popup if this partner is selected
        if (isSelected) {
          setTimeout(() => {
            marker.openPopup();
          }, 100);
        }
      });

      // Fit map viewport to include user and markers with generous padding
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [40, 40],
          maxZoom: 14,
        });
      }
    });
  }, [partners, userLocation, selectedPartnerId, isMapReady, isHindi, onSelectPartner]);

  // Pan to selected partner marker when changed from card click
  useEffect(() => {
    if (!selectedPartnerId || !markersRef.current[selectedPartnerId] || !mapInstanceRef.current) return;
    const marker = markersRef.current[selectedPartnerId];
    const latLng = marker.getLatLng();
    mapInstanceRef.current.panTo(latLng, { animate: true, duration: 0.5 });
    marker.openPopup();
  }, [selectedPartnerId]);

  if (mapError) {
    return (
      <div className={`bg-surface-muted rounded-card border border-border p-6 flex flex-col items-center justify-center text-center ${className}`}>
        <AlertTriangle className="w-8 h-8 text-amber-600 mb-2" />
        <h4 className="font-bold text-sm text-foreground mb-1">
          {isHindi ? "मानचित्र सेवा अस्थायी रूप से अनुपलब्ध" : "Interactive Map Unavailable"}
        </h4>
        <p className="text-xs text-muted-foreground max-w-sm">
          {isHindi
            ? "लाइव मानचित्र टाइलें लोड नहीं की जा सकीं। आप बाईं ओर दी गई सूची से किसी भी अधिकृत शाखा को चुन सकते हैं।"
            : "Map tiles could not be displayed. You can view all partner branch distances and choose an accredited partner from the list."}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-card overflow-hidden border border-border bg-surface-muted ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: "320px" }} />
    </div>
  );
}
