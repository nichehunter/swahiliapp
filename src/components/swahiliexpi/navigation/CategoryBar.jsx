"use client";

import { useEffect, useRef, useState } from "react";
import { useNotification } from "@/components/common/notification/NotificationProvider";
import {
  TrophyOutlined,
  CoffeeOutlined,
  ShopOutlined,
  TeamOutlined,
  BankOutlined,
  CustomerServiceOutlined,
  SmileOutlined,
  ReadOutlined,
  CompassOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { loadDictionary } from "@/services/config/dictinaryService";

const CATEGORY_ICONS = {
  sports: TrophyOutlined,
  foods: CoffeeOutlined,
  "trade & markets": ShopOutlined,
  "social & community": TeamOutlined,
  culture: BankOutlined,
  "music & fun": CustomerServiceOutlined,
  "family & kids": SmileOutlined,
  educations: ReadOutlined,
};

const getCategoryIcon = (name) => {
  const key = name?.trim().toLowerCase();

  return CATEGORY_ICONS[key] || CompassOutlined;
};

export default function CategoryBar({
  activeCategory = "explore",
  onCategoryChange,
}) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const viewportRef = useRef(null);
  const contentRef = useRef(null);

  const notify = useNotification();

  /* =========================================================
     LOAD CATEGORIES
     ========================================================= */

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      try {
        const resp = await loadDictionary(4);

        setCategories(resp?.results || []);
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

          if (Array.isArray(firstError) && firstError.length) {
            errorMessage = String(firstError[0]);
          } else if (typeof firstError === "string") {
            errorMessage = firstError;
          }
        }

        notify.error("Failed to load categories", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* =========================================================
     UPDATE ARROW VISIBILITY
     ========================================================= */

  const updateScrollState = () => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    const { scrollLeft, scrollWidth, clientWidth } = viewport;

    const tolerance = 2;

    setCanScrollLeft(scrollLeft > tolerance);

    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - tolerance);
  };

  /* =========================================================
     INITIALIZE SCROLL LISTENERS
     ========================================================= */

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    updateScrollState();

    const handleScroll = () => {
      updateScrollState();
    };

    viewport.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });

    resizeObserver.observe(viewport);

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      viewport.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [categories]);

  /* =========================================================
     SLIDE CATEGORY BAR
     ========================================================= */

  const slideCategories = (direction) => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    const amount = Math.max(viewport.clientWidth * 0.72, 220);

    viewport.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  /* =========================================================
     BRING ACTIVE CATEGORY INTO VIEW
     ========================================================= */

  useEffect(() => {
    if (!activeCategory || activeCategory === "explore") {
      return;
    }

    const viewport = viewportRef.current;

    if (!viewport) return;

    const activeButton = viewport.querySelector(
      `[data-category-id="${activeCategory}"]`,
    );

    if (!activeButton) return;

    const viewportRect = viewport.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    const isHiddenLeft = buttonRect.left < viewportRect.left;

    const isHiddenRight = buttonRect.right > viewportRect.right;

    if (isHiddenLeft || isHiddenRight) {
      activeButton.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCategory, categories]);

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="sw-category-wrapper">
        <div className="sw-category-viewport">
          <div className="sw-category-bar sw-category-skeleton-bar">
            <CategorySkeleton />
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     EMPTY
     ========================================================= */

  if (!categories.length) {
    return null;
  }

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="sw-category-wrapper">
      {/* LEFT ARROW */}

      <button
        type="button"
        className={`sw-category-nav sw-category-nav-left ${
          !canScrollLeft ? "disabled" : ""
        }`}
        onClick={() => slideCategories("left")}
        disabled={!canScrollLeft}
        aria-label="Previous categories"
      >
        <LeftOutlined />
      </button>

      {/* CATEGORY VIEWPORT */}

      <div ref={viewportRef} className="sw-category-viewport">
        <div ref={contentRef} className="sw-category-bar">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.dictionary_item_name);

            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                data-category-id={category.id}
                className={`sw-category ${isActive ? "active" : ""}`}
                onClick={() => onCategoryChange?.(category)}
              >
                <span className="sw-category-icon">
                  <Icon />
                </span>

                <span>{category.dictionary_item_name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT ARROW */}

      <button
        type="button"
        className={`sw-category-nav sw-category-nav-right ${
          !canScrollRight ? "disabled" : ""
        }`}
        onClick={() => slideCategories("right")}
        disabled={!canScrollRight}
        aria-label="Next categories"
      >
        <RightOutlined />
      </button>
    </div>
  );
}

/* =========================================================
   CATEGORY SKELETON
   ========================================================= */

function CategorySkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div key={item} className="sw-category-skeleton">
          <span className="sw-category-skeleton-icon" />
          <span className="sw-category-skeleton-text" />
        </div>
      ))}
    </>
  );
}
