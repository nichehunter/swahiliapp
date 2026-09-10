"use client";

import { CircleMarker } from "react-leaflet";

export default function CurrentLocationMarker({ location }) {
  if (!location) return null;

  return (
    <>
      {/* Accuracy / location pulse */}
      <CircleMarker
        center={location}
        radius={20}
        pathOptions={{
          stroke: false,
          fillColor: "#0077B6",
          fillOpacity: 0.12,
        }}
      />

      {/* Current location */}
      <CircleMarker
        center={location}
        radius={8}
        pathOptions={{
          color: "#ffffff",
          weight: 3,
          fillColor: "#0077B6",
          fillOpacity: 1,
        }}
      />
    </>
  );
}
