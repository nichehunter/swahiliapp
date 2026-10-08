"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import MapMarkers from "./MapMarkers";
import CurrentLocationMarker from "./CurrentLocationMarker";
import MapControls from "./MapControls";
import MapTileSwitcher from "./MapTileSwitcher";

const DAR_ES_SALAAM = [-6.7924, 39.2083];

const TILE_LAYERS = {
  street: {
    name: "street",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  },

  satellite: {
    name: "satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri",
  },
};

export default function SwahiliExpiMap({
  locations,

  activeCategory = "explore",

  search = "",

  center = DAR_ES_SALAAM,
  onViewportChange,
  currentLocation = null,
  categoryDrawerOpen,
  navigationDrawerOpen,
  onPlaceSelect,
  hoveredPlace,
}) {
  const [activeTile, setActiveTile] = useState("street");

  const currentLayer = TILE_LAYERS[activeTile];
  const saveViewRef = useRef(null);

  return (
    <div className="sw-map-container">
      <MapContainer
        center={center || DAR_ES_SALAAM}
        zoom={12}
        minZoom={8}
        maxZoom={19}
        zoomControl={false}
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={true}
        touchZoom={true}
        className="sw-map"
      >
        {/* Keep map size correct */}
        <MapResizeHandler />

        <MapViewMemory
          categoryDrawerOpen={categoryDrawerOpen}
          navigationDrawerOpen={navigationDrawerOpen}
          saveViewRef={saveViewRef}
        />

        <MapViewportListener onViewportChange={onViewportChange} />

        <HoveredPlaceController hoveredPlace={hoveredPlace} />

        <TileLayer
          key={activeTile}
          url={currentLayer.url}
          attribution={currentLayer.attribution}
        />

        {/* Move map when parent changes center */}
        <MapCenterController center={center} />

        {/* Current user's location */}
        <CurrentLocationMarker location={currentLocation} />

        {/* All place markers */}
        <MapMarkers
          locations={locations}
          activeCategory={activeCategory}
          search={search}
          onPlaceSelect={onPlaceSelect}
          hoveredPlace={hoveredPlace}
        />

        {/* Custom map controls */}
        <MapControls
          currentLocation={currentLocation}
          fallbackLocation={DAR_ES_SALAAM}
        />
        <MapTileSwitcher
          activeTile={activeTile}
          onTileChange={setActiveTile}
          // Preview images
          streetUrl="https://tile.openstreetmap.org/13/6220/4500.png"
          satelliteUrl="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/6220/4500"
        />
      </MapContainer>
    </div>
  );
}

function MapResizeHandler() {
  const map = require("react-leaflet").useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return null;
}

function MapCenterController({ center }) {
  const map = require("react-leaflet").useMap();

  useEffect(() => {
    if (!center) return;

    map.flyTo(center, 13, {
      duration: 1,
    });
  }, [center, map]);

  return null;
}

function HoveredPlaceController({ hoveredPlace }) {
  const map = require("react-leaflet").useMap();

  useEffect(() => {
    if (!hoveredPlace) return;

    map.flyTo(
      [hoveredPlace.latitude, hoveredPlace.longitude],
      Math.max(map.getZoom(), 14),
      {
        animate: true,
        duration: 0.5,
      },
    );
  }, [hoveredPlace, map]);

  return null;
}

function MapViewMemory({ categoryDrawerOpen, navigationDrawerOpen, saveViewRef }) {
  const map = require("react-leaflet").useMap();

  useEffect(() => {
    if (categoryDrawerOpen || navigationDrawerOpen) {
      const center = map.getCenter();

      saveViewRef.current = {
        center: [center.lat, center.lng],
        zoom: map.getZoom(),
      };

      return;
    }

    if (!saveViewRef.current) return;

    const { center, zoom } = saveViewRef.current;

    map.flyTo(center, zoom, {
      animate: true,
      duration: 0.5,
    });

    saveViewRef.current = null;
  }, [categoryDrawerOpen, navigationDrawerOpen, map, saveViewRef]);

  return null;
}

function MapViewportListener({ onViewportChange }) {
  const lastViewportRef = useRef(null);

  useMapEvents({
    moveend(event) {
      const map = event.target;
      const center = map.getCenter();

      const bounds = map.getBounds();

      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ].join(",");

      const zoom = map.getZoom();

      // First viewport
      if (!lastViewportRef.current) {
        lastViewportRef.current = {
          lat: center.lat,
          lng: center.lng,
          zoom,
        };

        onViewportChange?.({
          zoom,
          bbox,
        });

        return;
      }

      const previous = lastViewportRef.current;

      // Distance moved in meters
      const distance = map.distance(
        [previous.lat, previous.lng],
        [center.lat, center.lng],
      );

      // Only update when moved significantly
      const MIN_MOVE_DISTANCE = 500;

      // Always update when zoom changes
      const zoomChanged = previous.zoom !== zoom;

      if (distance < MIN_MOVE_DISTANCE && !zoomChanged) {
        return;
      }

      lastViewportRef.current = {
        lat: center.lat,
        lng: center.lng,
        zoom,
      };

      onViewportChange?.({
        zoom,
        bbox,
      });
    },
  });

  return null;
}
