"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import MapHeader from "@/components/swahiliexpi/navigation/MapHeader";
import BottomNavigation from "@/components/swahiliexpi/navigation/BottomNavigation";
import "@/styles/navigation/navigate.css";
import "@/styles/map/map.css";
import "@/styles/map/card.css";
import "@/styles/map/galary.css";
import CategoryDrawer from "@/components/swahiliexpi/map/CategoryDrawer";
import PlaceDetailsCard from "@/components/swahiliexpi/map/PlaceDetailsCard";
import { loadDictionaryParent } from "@/services/config/dictinaryService";
import { useNotification } from "@/components/common/notification/NotificationProvider";
import { loadEventMap } from "@/services/core/eventService";

const SwahiliExpiMap = dynamic(
  () => import("@/components/swahiliexpi/map/SwahiliExpiMap"),
  {
    ssr: false,
  },
);

const DAR_ES_SALAAM = [-6.7924, 39.2083];

export default function Map() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(DAR_ES_SALAAM);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("explore");
  const [activeNavigation, setActiveNavigation] = useState("explore");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryId, setSubcategoryId] = useState(null);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [drawerCategory, setDrawerCategory] = useState(null);
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationsPagination, setLocationsPagination] = useState({
    totalCount: 0,
    count: 0,
    limit: 500,
    offset: 0,
    hasMore: false,
  });
  const [loadingMoreLocations, setLoadingMoreLocations] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [index, setIndex] = useState(0);
  const [hasLoadedLocations, setHasLoadedLocations] = useState(false);
  const [mapViewport, setMapViewport] = useState({
    zoom: null,
    bbox: null,
  });
  const notify = useNotification();

  useEffect(() => {
    const fetchLocations = async () => {
      if (!mapViewport.bbox || !mapViewport.zoom) return;

      // Show full loading overlay only when we don't have locations yet
      const isInitialLoad = !hasLoadedLocations;

      if (isInitialLoad) {
        setLocationsLoading(true);
      }

      try {
        const response = await loadEventMap({
          bbox: mapViewport.bbox,
          zoom: mapViewport.zoom,
          search: search,
          categoryId: drawerCategory?.id,
          subcategoryId: subcategoryId,
          offset: 0,
          limit: 500,
        });
        setLocations(response?.results || []);
        setHasLoadedLocations(true);
        setLocationsPagination({
          totalCount: response?.total_count || 0,
          count: response?.count || 0,
          limit: response?.limit || 500,
          offset: response?.offset || 0,
          hasMore: response?.has_more || false,
        });
      } catch (error) {
        const responseData = error?.response?.data;
        let errorMessage = "Something went wrong. Please try again.";

        if (typeof responseData === "string") {
          errorMessage = responseData;
        } else if (responseData?.error) {
          errorMessage = responseData.error;
        } else if (responseData?.detail) {
          errorMessage = responseData.detail;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === "object") {
          const firstKey = Object.keys(responseData)[0];
          const firstError = responseData[firstKey];

          if (Array.isArray(firstError)) {
            errorMessage = `${firstError[0]}`;
          }
        }

        notify.error("failed to load locations", errorMessage);
      } finally {
        if (isInitialLoad) {
          setLocationsLoading(false);
        }
      }
    };

    fetchLocations();
  }, [mapViewport, index, drawerCategory, subcategoryId]);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];

        setCurrentLocation(coords);
        setMapCenter(coords);
      },

      () => {
        setMapCenter(DAR_ES_SALAAM);
      },

      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 300000,
      },
    );
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!drawerCategory) return;
      setSubcategoriesLoading(true);
      try {
        const resp = await loadDictionaryParent(12, drawerCategory?.id);
        setSubcategories(resp?.results);
      } catch (error) {
        const responseData = error?.response?.data;
        let errorMessage = "Something went wrong. Please try again.";

        if (typeof responseData === "string") {
          errorMessage = responseData;
        } else if (responseData?.error) {
          errorMessage = responseData.error;
        } else if (responseData?.detail) {
          errorMessage = responseData.detail;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === "object") {
          const firstKey = Object.keys(responseData)[0];
          const firstError = responseData[firstKey];
          if (Array.isArray(firstError)) {
            errorMessage = `${firstError[0]}`;
          }
        }
        notify.error("failed to load sub-categories", errorMessage);
      } finally {
        setSubcategoriesLoading(false);
      }
    };
    fetchSubCategories();
  }, [drawerCategory]);

  const handleCategoryChange = (category) => {
    if (category === "explore") {
      setCategoryDrawerOpen(false);
      setDrawerCategory(null);
      setActiveCategory("explore");
      return;
    }

    setActiveCategory(category);
    setDrawerCategory(category);
    setCategoryDrawerOpen(true);
  };

  const handleCategoryDrawerClose = () => {
    setCategoryDrawerOpen(false);
    setDrawerCategory(null);
    setActiveCategory("explore");
    setFilterValues({});
  };

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleBottomNavigation = (item) => {
    setActiveNavigation(item);

    if (item === "explore" || item === "events") {
      setActiveCategory(item);
    }
  };

  const loadMoreLocations = async () => {
    if (
      loadingMoreLocations ||
      !locationsPagination.hasMore ||
      !mapViewport.bbox ||
      !mapViewport.zoom
    ) {
      return;
    }

    setLoadingMoreLocations(true);

    try {
      const nextOffset = locationsPagination.offset + locationsPagination.count;

      const response = await loadEventMap({
        bbox: mapViewport.bbox,
        zoom: mapViewport.zoom,
        search,
        categoryId: drawerCategory?.id,
        subcategoryId,

        limit: locationsPagination.limit,
        offset: nextOffset,
      });

      const newLocations = response?.results || [];

      setLocations((previous) => [...previous, ...newLocations]);

      setLocationsPagination({
        totalCount: response?.total_count || 0,
        count: response?.count || 0,
        limit: response?.limit || locationsPagination.limit,
        offset: response?.offset ?? nextOffset,
        hasMore: response?.has_more || false,
      });
    } catch (error) {
      const responseData = error?.response?.data;
      let errorMessage = "Something went wrong. Please try again.";

      if (typeof responseData === "string") {
        errorMessage = responseData;
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      } else if (responseData?.detail) {
        errorMessage = responseData.detail;
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (typeof responseData === "object") {
        const firstKey = Object.keys(responseData)[0];
        const firstError = responseData[firstKey];

        if (Array.isArray(firstError)) {
          errorMessage = `${firstError[0]}`;
        }
      }

      notify.error("failed to load locations", errorMessage);
    } finally {
      setLoadingMoreLocations(false);
    }
  };

  return (
    <div className="sw-map-page">
      <SwahiliExpiMap
        center={mapCenter}
        currentLocation={currentLocation}
        activeCategory={activeCategory}
        categoryDrawerOpen={categoryDrawerOpen}
        search={search}
        onPlaceSelect={(place) => {
          setSelectedPlace(place);
        }}
        locations={locations}
        hoveredPlace={hoveredPlace}
        onViewportChange={(nextViewport) => {
          setMapViewport((previous) => {
            if (
              previous.zoom === nextViewport.zoom &&
              previous.bbox === nextViewport.bbox
            ) {
              return previous;
            }

            return nextViewport;
          });
        }}
      />

      {locationsLoading && (
        <div className="sw-map-loading-overlay">
          <div className="sw-map-loader">
            <div className="sw-loader-ring">
              <div className="sw-loader-inner">
                <span className="sw-loader-dot" />
              </div>
            </div>

            <strong>Discovering places</strong>

            <span>Finding amazing places around you...</span>
          </div>
        </div>
      )}

      <MapHeader
        search={search}
        onSearchChange={setSearch}
        onSearchClear={() => {
          setSearch("");
          setHasLoadedLocations(false);
          setIndex((prev) => prev + 1);
        }}
        onSearch={() => {
          setIndex((prev) => prev + 1);
          setHasLoadedLocations(false);
        }}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        categoryDrawerOpen={categoryDrawerOpen}
        onBrandClick={() => {
          setActiveCategory("explore");
          setActiveNavigation("explore");
          setSearch("");
        }}
        menuOpen={menuOpen}
        onMenu={() => setMenuOpen(true)}
        onMenuClose={() => setMenuOpen(false)}
        onMenuNavigate={(item) => {
          console.log("Navigate:", item);
        }}
        onSaved={() => console.log("Saved")}
        onSignIn={() => console.log("Sign in")}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
      />

      <CategoryDrawer
        open={categoryDrawerOpen}
        category={drawerCategory}
        locations={locations}
        pagination={locationsPagination}
        loadingMore={loadingMoreLocations}
        onLoadMore={loadMoreLocations}
        subcategories={subcategories}
        subcategoryId={subcategoryId}
        setSubcategoryId={setSubcategoryId}
        subcategoriesLoading={subcategoriesLoading}
        onClose={() => {
          handleCategoryDrawerClose();
        }}
        onPlaceSelect={(place) => {
          setSelectedPlace(place);
        }}
        hoveredPlace={hoveredPlace}
        onPlaceHover={setHoveredPlace}
        search={search}
        onSearchChange={setSearch}
        onSearchClear={() => {
          setSearch("");
          setHasLoadedLocations(false);
          setIndex((prev) => prev + 1);
        }}
        onSearch={() => {
          setIndex((prev) => prev + 1);
          setHasLoadedLocations(false);
        }}
      />

      <PlaceDetailsCard
        place={selectedPlace}
        open={!!selectedPlace}
        categoryDrawerOpen={categoryDrawerOpen}
        onClose={() => setSelectedPlace(null)}
      />

      <BottomNavigation
        activeItem={activeNavigation}
        onChange={handleBottomNavigation}
      />
    </div>
  );
}
