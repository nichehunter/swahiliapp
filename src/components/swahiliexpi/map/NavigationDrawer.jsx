"use client";

import {
  SearchOutlined,
  CloseOutlined,
  StarFilled,
  DownOutlined,
} from "@ant-design/icons";
import { Select, Image } from "antd";
import { useState } from "react";
import { toLowerCase, toSmartTitleCase } from "@/libs/utils/char";
import { fNumber, fNumberDoublePoint, fNumberPoint } from "@/libs/utils/number";

export default function NavigationDrawer({
  open = false,
  navigation,
  loadingLocation,
  locations = [],
  pagination,
  loadingMore = false,
  onLoadMore,
  onClose,
  onPlaceSelect,
  hoveredPlace,
  onPlaceHover,
  onSearchChange,
  onSearchClear,
  onSearch,
  search,
}) {
  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!search.trim()) return;
    onSearch?.(search.trim());
  };

  const handlePlaceSelect = (place) => {
    onPlaceSelect?.(place);

    // Close category drawer on tablet/mobile
    if (window.matchMedia("(max-width: 991px)").matches) {
      onClose?.();
    }
  };

  return (
    <aside className="sw-category-drawer">
      {/* HEADER */}
      <div className="sw-category-drawer-header">
        <div>
          <span className="sw-category-drawer-eyebrow">DISCOVER</span>

          <h2>{toSmartTitleCase(navigation?.label || "name")}</h2>
        </div>

        <button
          type="button"
          className="sw-category-drawer-close"
          onClick={onClose}
          aria-label="Close category"
        >
          <CloseOutlined />
        </button>
      </div>

      {/* SEARCH */}
      <form className="sw-category-drawer-search" onSubmit={handleSubmit}>
        <SearchOutlined className="sw-category-drawer-search-icon" />

        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={`Search ${toLowerCase(navigation?.label || "NAME")}...`}
          aria-label={`Search ${navigation?.label || "NAME"}`}
        />

        {search && (
          <button
            type="button"
            className="sw-category-drawer-search-clear"
            onClick={onSearchClear}
            aria-label="Clear search"
          >
            <CloseOutlined />
          </button>
        )}

        {search.trim() && (
          <button
            type="submit"
            className="sw-category-drawer-search-submit"
            aria-label="Search"
            title="Search"
          >
            <SearchOutlined />
          </button>
        )}
      </form>

      {/* SCROLLABLE CONTENT */}
      <div className="sw-category-drawer-body">
        {/* ADVERTISEMENT */}
        <a
          href="https://unsplash.com/photos/R3cZXp9Phrk"
          target="_blank"
          rel="noopener noreferrer"
          className="sw-category-ad"
        >
          <Image
            src="/assets/images/hero/hero.jpg"
            alt="Discover Tanzania"
            sizes="330px"
            className="sw-category-ad-image"
          />

          <div className="sw-category-ad-overlay">
            <span>ADVERTISEMENT</span>
            <strong>Discover Tanzania</strong>
            <small>Explore unforgettable experiences</small>
          </div>
        </a>

        {/* RESULT COUNT */}
        <div className="sw-category-result-header">
          <span>
            {locations.length} {locations.length === 1 ? "place" : "places"}
          </span>
        </div>

        {/* LIST */}
        <div className="sw-category-list">
          {loadingLocation ? (
            <>
              <CategoryPlaceSkeleton />
              <CategoryPlaceSkeleton />
              <CategoryPlaceSkeleton />
              <CategoryPlaceSkeleton />
            </>
          ) : locations.length > 0 ? (
            locations.map((place) => (
              <button
                type="button"
                key={place.entity_id}
                className="sw-category-place"
                onClick={() => handlePlaceSelect(place)}
                onMouseEnter={() => onPlaceHover?.(place)}
                onMouseLeave={() => onPlaceHover?.(null)}
              >
                <div className="sw-category-place-image">
                  <Image
                    src={place.image_url}
                    alt={place.title}
                    sizes="92px"
                    className="sw-category-place-img"
                  />
                </div>

                <div className="sw-category-place-info">
                  <h3>{toSmartTitleCase(place.title)}</h3>

                  <span className="sw-category-place-type">
                    {toSmartTitleCase(place.category_name)}
                  </span>

                  <div className="sw-category-place-rating">
                    <StarFilled />

                    <strong>{fNumberPoint(place.average_rating)}</strong>

                    <span>({fNumber(place.total_reviews)})</span>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="sw-category-empty">
              <div className="sw-category-empty-icon">
                <SearchOutlined />
              </div>

              <strong>No places found</strong>

              <span>
                There are currently no{" "}
                {toSmartTitleCase(navigation?.label || "name")} available.
              </span>
            </div>
          )}
        </div>
        {pagination?.hasMore && locations.length > 0 && (
          <button
            type="button"
            className="sw-category-load-more"
            onClick={onLoadMore}
            disabled={loadingMore}
            aria-label="Load more places"
            title="Load more places"
          >
            {loadingMore ? (
              <span className="sw-category-load-more-spinner" />
            ) : (
              <DownOutlined />
            )}
          </button>
        )}
      </div>
    </aside>
  );
}

function CategoryPlaceSkeleton() {
  return (
    <div className="sw-category-place sw-category-place-skeleton">
      <div className="sw-category-place-image">
        <div className="sw-category-skeleton-image" />
      </div>

      <div className="sw-category-place-info">
        <div className="sw-category-skeleton-title" />
        <div className="sw-category-skeleton-type" />

        <div className="sw-category-skeleton-rating" />
      </div>
    </div>
  );
}
