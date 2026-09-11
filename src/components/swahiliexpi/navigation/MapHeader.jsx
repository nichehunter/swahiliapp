"use client";

import { useState } from "react";

import Brand from "./Brand";
import SearchBar from "./SearchBar";
import CategoryBar from "./CategoryBar";
import HeaderActions from "./HeaderActions";
import SideDrawer from "./SideDrawer";
import FilterBar from "./FilterBar";

export default function MapHeader({
  search,
  onSearchChange,
  onSearchClear,
  onSearch,

  activeCategory,
  onCategoryChange,
  categories,

  onBrandClick,
  onSaved,
  onSignIn,
  categoryDrawerOpen = false,
  menuOpen,
  onMenu,
  onMenuClose,
  onMenuNavigate,
  filterValues,
  onFilterChange,
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleMobileSearchToggle = () => {
    setMobileSearchOpen((prev) => !prev);
  };

  return (
    <header
      className={`sw-map-header ${
        mobileSearchOpen ? "mobile-search-active" : ""
      }`}
    >
      {/* Brand */}
      <Brand onClick={onBrandClick} onMenu={onMenu} />

      {!categoryDrawerOpen && (
        <SearchBar
          value={search}
          onChange={onSearchChange}
          onClear={onSearchClear}
          onSearch={onSearch}
          mobileOpen={mobileSearchOpen}
          onMobileToggle={handleMobileSearchToggle}
        />
      )}

      {/* CENTER */}
      <div
        className={`sw-map-header-center ${
          categoryDrawerOpen ? "filters-active" : ""
        }`}
      >
        {!categoryDrawerOpen ? (
          <div className="sw-category-wrapper">
            <CategoryBar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={onCategoryChange}
            />
          </div>
        ) : (
          <div className="sw-filter-wrapper">
            <FilterBar values={filterValues} onChange={onFilterChange} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="sw-map-header-actions">
        <HeaderActions onSaved={onSaved} onSignIn={onSignIn} onMenu={onMenu} />
      </div>

      <SideDrawer
        open={menuOpen}
        onClose={onMenuClose}
        activeItem={activeCategory}
        onNavigate={onMenuNavigate}
        onSignIn={onSignIn}
      />
    </header>
  );
}
