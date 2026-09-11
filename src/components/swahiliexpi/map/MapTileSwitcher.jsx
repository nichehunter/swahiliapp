"use client";

import { Image } from "antd";
import { useMap } from "react-leaflet";

export default function MapTileSwitcher({
  satelliteUrl,
  streetUrl,
  activeTile,
  onTileChange,
}) {
  const map = useMap();

  const isStreet = activeTile === "street";

  const handleChange = () => {
    const nextTile = isStreet ? "satellite" : "street";

    onTileChange?.(nextTile);

    // Optional: slightly refresh the map rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  };

  return (
    <button
      type="button"
      className="sw-map-tile-switcher"
      onClick={handleChange}
      aria-label={`Switch to ${isStreet ? "satellite" : "street"} map`}
    >
      <Image
        src={isStreet ? satelliteUrl : streetUrl}
        alt=""
        className="sw-map-tile-preview"
        preview={false}
      />

      <span className="sw-map-tile-label">
        {isStreet ? "Satellite" : "Map"}
      </span>
    </button>
  );
}
