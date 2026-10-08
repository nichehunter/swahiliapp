"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import MapPopup from "./MapPopup";
import { useEffect, useRef } from "react";
import { toSmartTitleCase } from "@/libs/utils/char";

const CATEGORY_CONFIG = {
  sports: {
    symbol: "★",
    color: "#0077B6",
  },

  foods: {
    symbol: "●",
    color: "#FF7A00",
  },

  "trade & markets": {
    symbol: "⌂",
    color: "#7C3AED",
  },

  "social & community": {
    symbol: "◆",
    color: "#E11D48",
  },

  culture: {
    symbol: "◈",
    color: "#00A8CC",
  },

  "music & fun": {
    symbol: "♫",
    color: "#16A34A",
  },

  "family & kids": {
    symbol: "♥",
    color: "#DB2777",
  },

  educations: {
    symbol: "✎",
    color: "#CA8A04",
  },
};

function createPlaceIcon(category, title) {
  const config = CATEGORY_CONFIG[category] || {
    symbol: "●",
    color: "#0077B6",
  };

  const safeTitle = String(title || "Place")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  return L.divIcon({
    className: "sw-place-marker-wrapper",

    html: `
      <div
        class="sw-place-marker-container"
        style="--marker-color:${config.color}"
      >
        <div class="sw-place-marker">
          <span>${config.symbol}</span>
        </div>

        <span class="sw-place-marker-title">
          ${toSmartTitleCase(safeTitle)}
        </span>
      </div>
    `,

    iconSize: [28, 36],
    iconAnchor: [14, 40],
    popupAnchor: [12, -34],
  });
}

export default function MapMarkers({
  locations = [],
  onPlaceSelect,
  hoveredPlace,
}) {
  const markerRefs = useRef({});
  const hoverTimerRef = useRef(null);

  // Clear timer when component unmounts
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Always clear pending hover timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    if (hoveredPlace) {
      const marker = markerRefs.current[hoveredPlace.entity_id];

      if (marker) {
        marker.openPopup();
      }

      return;
    }

    Object.values(markerRefs.current).forEach((marker) => {
      marker?.closePopup();
    });
  }, [hoveredPlace]);

  const closeAllPopups = () => {
    Object.values(markerRefs.current).forEach((marker) => {
      marker?.closePopup();
    });
  };

  return (
    <>
      {locations?.map((place) => (
        <Marker
          key={place.entity_id}
          position={[place.latitude, place.longitude]}
          ref={(marker) => {
            if (marker) {
              markerRefs.current[place.entity_id] = marker;
            }
          }}
          icon={createPlaceIcon(place.category_name, place.title)}
          eventHandlers={{
            mouseover: (event) => {
              const marker = event.target;

              // Cancel previous marker's pending popup
              if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
              }

              // Close any popup currently open
              closeAllPopups();

              // Delay opening
              hoverTimerRef.current = setTimeout(() => {
                marker.openPopup();
                hoverTimerRef.current = null;
              }, 180);
            },

            mouseout: (event) => {
              const marker = event.target;

              // Cancel popup that has not opened yet
              if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
                hoverTimerRef.current = null;
              }

              // Give the mouse a little time to move into the popup
              setTimeout(() => {
                const popup = marker.getPopup();

                if (!popup) return;

                const popupElement = popup.getElement();

                if (popupElement?.matches(":hover")) {
                  return;
                }

                marker.closePopup();
              }, 150);
            },

            click: (event) => {
              // Cancel hover popup timer
              if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
                hoverTimerRef.current = null;
              }

              // Close small popup
              event.target.closePopup();

              // Open full details
              onPlaceSelect?.(place);
            },
          }}
        >
          <Popup
            closeButton={false}
            closeOnClick={false}
            autoClose={false}
            autoPan={false}
          >
            <MapPopup place={place} />
          </Popup>
        </Marker>
      ))}
    </>
  );
}
