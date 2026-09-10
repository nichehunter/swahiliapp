"use client";

import { useMap } from "react-leaflet";
import { AimOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";

function ControlButton({ children, onClick, title }) {
  return (
    <button
      type="button"
      className="sw-map-control-button"
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

export default function MapControls({ currentLocation, fallbackLocation }) {
  const map = useMap();

  const handleLocate = () => {
    const target = currentLocation || fallbackLocation;

    if (!target) return;

    map.flyTo(target, 15, {
      duration: 1,
    });
  };

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="sw-custom-map-controls">
      <ControlButton title="My location" onClick={handleLocate}>
        <AimOutlined />
      </ControlButton>

      <div className="sw-map-control-divider" />

      <ControlButton title="Zoom in" onClick={handleZoomIn}>
        <PlusOutlined />
      </ControlButton>

      <ControlButton title="Zoom out" onClick={handleZoomOut}>
        <MinusOutlined />
      </ControlButton>
    </div>
  );
}
