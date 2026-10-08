"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

import MapHeader from "@/components/swahiliexpi/navigation/MapHeader";
import CategoryDrawer from "@/components/swahiliexpi/map/CategoryDrawer";
import PlaceDetailsCard from "@/components/swahiliexpi/map/PlaceDetailsCard";

import "@/styles/navigation/navigate.css";
import "@/styles/map/map.css";
import "@/styles/map/card.css";
import "@/styles/map/galary.css";

import { loadDictionaryParent } from "@/services/config/dictinaryService";
import {
  loadEventMap,
  loadEventShared,
  loadNavigationEventMap,
} from "@/services/gateway/eventService";

import { postView } from "@/services/engagement/engagementService";

import { useNotification } from "@/components/common/notification/NotificationProvider";
import NavigationDrawer from "@/components/swahiliexpi/map/NavigationDrawer";
import recentEventStore from "@/stores/recentEventStore";

const SwahiliExpiMap = dynamic(
  () => import("@/components/swahiliexpi/map/SwahiliExpiMap"),
  {
    ssr: false,
  },
);

const DAR_ES_SALAAM = [-6.7924, 39.2083];

export default function MapExperience({
  mode = "normal",
  sharedEventSlug = null,
}) {
  const router = useRouter();
  const notify = useNotification();
  const user = useAuthStore((state) => state.user);
  const recentEventIdsString = recentEventStore((state) =>
    state.recentEventIds.join(","),
  );
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [sharedModeActive, setSharedModeActive] = useState(mode === "shared");

  const [sharedEvent, setSharedEvent] = useState(null);
  const [sharedEventLoading, setSharedEventLoading] = useState(
    mode === "shared",
  );

  const [currentLocation, setCurrentLocation] = useState(null);

  const [mapCenter, setMapCenter] = useState(DAR_ES_SALAAM);

  const [mapInitializing, setMapInitializing] = useState(true);

  const [locations, setLocations] = useState([]);

  const [locationsLoading, setLocationsLoading] = useState(false);

  const [locationsPagination, setLocationsPagination] = useState({
    totalCount: 0,
    count: 0,
    limit: 500,
    offset: 0,
    hasMore: false,
  });

  const [loadingMoreLocations, setLoadingMoreLocations] = useState(false);

  const [drawerCategory, setDrawerCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeNavigation, setActiveNavigation] = useState(null);
  const [categories, setCategories] = useState([]);
  const [markerMove, setMarkerMove] = useState(false);

  const [subcategories, setSubcategories] = useState([]);

  const [subcategoryId, setSubcategoryId] = useState(null);

  const [subcategoriesLoading, setSubcategoriesLoading] = useState(true);

  const [filterValues, setFilterValues] = useState({});

  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [navigationDrawerOpen, setNavigationDrawerOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedPlace, setSelectedPlace] = useState(null);

  const [hoveredPlace, setHoveredPlace] = useState(null);

  const [loadingDetails, setLoadingDetails] = useState(false);

  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [mapViewport, setMapViewport] = useState({
    zoom: null,
    bbox: null,
  });

  const [index, setIndex] = useState(0);

  const [hasLoadedLocations, setHasLoadedLocations] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setTimeout(() => {
        setMapInitializing(false);
      }, 0);

      if (!sharedModeActive) {
        setTimeout(() => {
          setMapCenter(DAR_ES_SALAAM);
        }, 0);
      }

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];

        setCurrentLocation(coords);

        if (!sharedModeActive) {
          setMapCenter(coords);
        }

        setMapInitializing(false);
      },

      () => {
        if (!sharedModeActive) {
          setMapCenter(DAR_ES_SALAAM);
        }

        setMapInitializing(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 300000,
      },
    );
  }, [sharedModeActive]);

  useEffect(() => {
    if (!sharedModeActive || !sharedEventSlug) {
      setTimeout(() => {
        setSharedEventLoading(false);
      }, 0);
      return;
    }

    let cancelled = false;

    const fetchSharedEvent = async () => {
      setSharedEventLoading(true);

      try {
        const response = await loadEventShared({ dataId: sharedEventSlug });

        if (cancelled) {
          return;
        }

        if (!response) {
          throw new Error("Event not found");
        }

        setSharedEvent(response);

        if (
          response.latitude !== undefined &&
          response.longitude !== undefined
        ) {
          setMapCenter([Number(response.latitude), Number(response.longitude)]);
        }

        setSelectedPlace(response);

        if (response.entity_id) {
          postView(response.entity_id).catch(() => {});
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        notify.error(
          "Event not found",
          "This event could not be found or is no longer available.",
        );

        setSharedEvent(null);
      } finally {
        if (!cancelled) {
          setSharedEventLoading(false);
        }
      }
    };

    fetchSharedEvent();

    return () => {
      cancelled = true;
    };
  }, [sharedModeActive, sharedEventSlug]);

  useEffect(() => {
    if (sharedModeActive) {
      return;
    }

    if (navigationDrawerOpen) {
      return;
    }

    if (markerMove) {
      return;
    }

    if (!mapViewport.bbox || !mapViewport.zoom) {
      return;
    }

    const fetchLocations = async () => {
      const isFilterChange =
        index !== undefined ||
        drawerCategory !== undefined ||
        subcategoryId !== undefined;

      const shouldShowLoading = !hasLoadedLocations || isFilterChange;

      if (shouldShowLoading) {
        setLocationsLoading(true);
      }

      try {
        const response = await loadEventMap({
          bbox: mapViewport.bbox,
          zoom: mapViewport.zoom,
          search,
          categoryId: drawerCategory?.id,
          subcategoryId,
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
        } else if (responseData && typeof responseData === "object") {
          const firstKey = Object.keys(responseData)[0];
          const firstError = responseData[firstKey];

          if (Array.isArray(firstError)) {
            errorMessage = `${firstError[0]}`;
          }
        }

        notify.error("Failed to load locations", errorMessage);
      } finally {
        if (shouldShowLoading) {
          setLocationsLoading(false);
        }
      }
    };

    fetchLocations();
  }, [mapViewport, index, drawerCategory, subcategoryId, sharedModeActive]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!drawerCategory) {
        setSubcategories([]);
        setSubcategoriesLoading(false);
        return;
      }

      setSubcategoriesLoading(true);
      setMarkerMove(false);

      try {
        const response = await loadDictionaryParent(12, drawerCategory?.id);

        setSubcategories(response?.results || []);
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
        } else if (responseData && typeof responseData === "object") {
          const firstKey = Object.keys(responseData)[0];
          const firstError = responseData[firstKey];

          if (Array.isArray(firstError)) {
            errorMessage = `${firstError[0]}`;
          }
        }

        notify.error("Failed to load sub-categories", errorMessage);
      } finally {
        setSubcategoriesLoading(false);
      }
    };

    fetchSubCategories();
  }, [drawerCategory]);

  useEffect(() => {
    if (!navigationDrawerOpen) {
      return;
    }

    if (!activeNavigation) {
      return;
    }

    if (activeNavigation?.key === "bookmarks" && !isAuthenticated) {
      setTimeout(() => {
        notify.error("Error", "You must be authenticated to view bookmarks.");
        setNavigationDrawerOpen(false);
        setIndex((prev) => prev + 1);
      }, 0);
      return;
    }

    setTimeout(() => {
      setLocations([]);
    }, 0);

    const fetchLocations = async () => {
      setLocationsLoading(true);

      try {
        const response = await loadNavigationEventMap({
          search,
          bookmarked_only:
            activeNavigation?.key === "bookmarks" ? true : undefined,
          user_id: isAuthenticated ? user?.id : undefined,
          is_featured: activeNavigation?.key === "featured" ? true : undefined,
          is_trending: activeNavigation?.key === "trending" ? true : undefined,
          entity_ids:
            activeNavigation?.key === "recent"
              ? recentEventIdsString
              : undefined,
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
        } else if (responseData && typeof responseData === "object") {
          const firstKey = Object.keys(responseData)[0];
          const firstError = responseData[firstKey];

          if (Array.isArray(firstError)) {
            errorMessage = `${firstError[0]}`;
          }
        }

        notify.error("Failed to load locations", errorMessage);
      } finally {
        setLocationsLoading(false);
      }
    };

    fetchLocations();
  }, [navigationDrawerOpen, activeNavigation, index]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setDrawerCategory(category);
    setCategoryDrawerOpen(true);
    setNavigationDrawerOpen(false);
    setMarkerMove(false);
  };

  const handleNavigationDrawerChange = (item) => {
    setActiveCategory(null);
    setDrawerCategory(null);
    setCategoryDrawerOpen(false);
    setNavigationDrawerOpen(true);
    setActiveNavigation(item);
    setMarkerMove(false);
  };

  const handleCategoryDrawerClose = () => {
    setCategoryDrawerOpen(false);

    setDrawerCategory(null);

    setActiveCategory(null);

    setSubcategoryId(null);

    setSubcategories([]);

    setFilterValues({});
    setMarkerMove(false);
  };

  const handleNavigationDrawerClose = () => {
    setNavigationDrawerOpen(false);
    setMarkerMove(false);
  };

  const handleFilterChange = (key, value) => {
    setMarkerMove(false);
    setFilterValues((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const loadMoreLocations = async () => {
    if (
      loadingMoreLocations ||
      !locationsPagination.hasMore ||
      !mapViewport.bbox ||
      !mapViewport.zoom ||
      sharedModeActive
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
      }

      notify.error("Failed to load locations", errorMessage);
    } finally {
      setLoadingMoreLocations(false);
    }
  };

  const handlePlaceSelect = async (place) => {
    setSelectedPlace(place);
    setMarkerMove(false);

    try {
      if (place?.entity_id) {
        await postView(place.entity_id);
      }
    } catch (error) {
      console.error("Failed to post view:", error);
    }
  };

  const handlePlaceDetailsClose = () => {
    setSelectedPlace(null);
    setMarkerMove(false);

    if (sharedModeActive) {
      setSharedModeActive(false);

      setSharedEvent(null);

      setSearch("");

      setDrawerCategory(null);

      setSubcategoryId(null);

      setSubcategories([]);

      setFilterValues({});

      setActiveCategory("explore");

      setCategoryDrawerOpen(false);

      setHasLoadedLocations(false);

      setLocations([]);

      setLocationsPagination({
        totalCount: 0,
        count: 0,
        limit: 500,
        offset: 0,
        hasMore: false,
      });

      if (currentLocation) {
        setMapCenter(currentLocation);
      } else {
        setMapCenter(DAR_ES_SALAAM);
      }

      router.replace("/");

      setIndex((previous) => previous + 1);
    }
  };

  const handleSearchClear = () => {
    setSearch("");
    setMarkerMove(false);

    setHasLoadedLocations(false);

    setIndex((previous) => previous + 1);
  };

  const handleSearch = () => {
    setHasLoadedLocations(false);
    setMarkerMove(false);

    setIndex((previous) => previous + 1);
  };

  const handleBrandClick = () => {
    setActiveCategory(null);
    setSearch("");
  };

  const handleViewportChange = (nextViewport) => {
    setMapViewport((previous) => {
      if (
        previous.zoom === nextViewport.zoom &&
        previous.bbox === nextViewport.bbox
      ) {
        return previous;
      }

      return nextViewport;
    });
  };

  const mapLocations = sharedModeActive
    ? sharedEvent
      ? [sharedEvent]
      : []
    : locations;

  const showMapLoading =
    sharedEventLoading ||
    mapInitializing ||
    (locationsLoading && !loadingDetails && !sharedModeActive);

  return (
    <div className="sw-map-page">
      <SwahiliExpiMap
        center={mapCenter}
        currentLocation={currentLocation}
        activeCategory={activeCategory}
        categoryDrawerOpen={categoryDrawerOpen}
        navigationDrawerOpen={navigationDrawerOpen}
        search={search}
        onPlaceSelect={handlePlaceSelect}
        locations={mapLocations}
        hoveredPlace={hoveredPlace}
        onViewportChange={handleViewportChange}
      />

      {showMapLoading && (
        <div className="sw-map-loading-overlay">
          <div className="sw-map-loader">
            <div className="sw-loader-ring">
              <div className="sw-loader-inner">
                <span className="sw-loader-dot" />
              </div>
            </div>

            <strong>
              {sharedEventLoading
                ? "Loading event"
                : mapInitializing
                  ? "Finding your location"
                  : "Discovering places"}
            </strong>

            <span>
              {sharedEventLoading
                ? "Preparing this place for you..."
                : mapInitializing
                  ? "Preparing the map around you..."
                  : "Finding amazing places around you..."}
            </span>
          </div>
        </div>
      )}

      <MapHeader
        search={search}
        onSearchChange={setSearch}
        onSearchClear={handleSearchClear}
        onSearch={handleSearch}
        categories={categories}
        setCategories={setCategories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        categoryDrawerOpen={categoryDrawerOpen}
        navigationDrawerOpen={navigationDrawerOpen}
        onBrandClick={handleBrandClick}
        menuOpen={menuOpen}
        onMenu={() => setMenuOpen(true)}
        onMenuClose={() => setMenuOpen(false)}
        onMenuNavigate={(item) => {
          handleNavigationDrawerChange(item);
        }}
        onSaved={() => {
          console.log("Saved");
        }}
        onSignIn={() => {
          console.log("Sign in");
        }}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        setAuthModalOpen={setAuthModalOpen}
        authModalOpen={authModalOpen}
      />

      <CategoryDrawer
        open={categoryDrawerOpen}
        category={drawerCategory}
        locations={locations}
        pagination={locationsPagination}
        loadingLocation={locationsLoading}
        loadingMore={loadingMoreLocations}
        onLoadMore={loadMoreLocations}
        subcategories={subcategories}
        subcategoryId={subcategoryId}
        setSubcategoryId={setSubcategoryId}
        subcategoriesLoading={subcategoriesLoading}
        onClose={handleCategoryDrawerClose}
        onPlaceSelect={(place) => {
          setSelectedPlace(place);
        }}
        hoveredPlace={hoveredPlace}
        onPlaceHover={(place) => {
          setHoveredPlace(place);
          setMarkerMove(true);
        }}
        search={search}
        onSearchChange={setSearch}
        onSearchClear={handleSearchClear}
        onSearch={handleSearch}
      />

      <NavigationDrawer
        open={navigationDrawerOpen}
        navigation={activeNavigation}
        locations={locations}
        pagination={locationsPagination}
        loadingLocation={locationsLoading}
        loadingMore={loadingMoreLocations}
        onLoadMore={loadMoreLocations}
        onClose={handleNavigationDrawerClose}
        onPlaceSelect={(place) => {
          setSelectedPlace(place);
        }}
        hoveredPlace={hoveredPlace}
        onPlaceHover={setHoveredPlace}
        search={search}
        onSearchChange={setSearch}
        onSearchClear={handleSearchClear}
        onSearch={handleSearch}
      />

      <PlaceDetailsCard
        place={selectedPlace}
        open={!!selectedPlace}
        categoryDrawerOpen={categoryDrawerOpen}
        navigationDrawerOpen={navigationDrawerOpen}
        onClose={handlePlaceDetailsClose}
        setLoadingDetails={setLoadingDetails}
        loadingDetails={loadingDetails}
        setAuthModalOpen={setAuthModalOpen}
      />
    </div>
  );
}
