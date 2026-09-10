"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import MapPopup from "./MapPopup";
import { useEffect, useRef } from "react";

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

function createPlaceIcon(category) {
  const config = CATEGORY_CONFIG[category] || {};

  return L.divIcon({
    className: "sw-place-marker-wrapper",

    html: `
      <div
        class="sw-place-marker"
        style="--marker-color:${config.color}"
      >
        <span>${config.symbol}</span>
      </div>
    `,

    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
}

export default function MapMarkers({
  locations = [],
  activeCategory = "explore",
  onPlaceSelect,
  hoveredPlace,
}) {

  const markerRefs = useRef({});

  

  useEffect(() => {
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

  
  

  return (
    <>
      {locations?.map((place) => (
        <Marker
          key={place.entity_id}
          position={[place.latitude, place.longitude]}
          ref={(marker) => {
            markerRefs.current[place.entity_id] = marker;
          }}
          icon={createPlaceIcon(place.category_name)}
          eventHandlers={{
            mouseover: (event) => {
              event.target.openPopup();
            },

            mouseout: (event) => {
              const marker = event.target;

              setTimeout(() => {
                const popup = marker.getPopup();
                if (!popup) return;

                const popupElement = popup.getElement();

                if (popupElement?.matches(":hover")) {
                  return;
                }

                marker.closePopup();
              }, 200);
            },

            click: (event) => {
              // Close the small hover popup
              event.target.closePopup();

              // Open the full details card
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
