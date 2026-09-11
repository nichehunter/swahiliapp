"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CloseOutlined,
  EyeOutlined,
  HeartFilled,
  HeartOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  PhoneOutlined,
  StarFilled,
  StarOutlined,
  UserOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  CarOutlined,
  WifiOutlined,
  MedicineBoxOutlined,
  LockOutlined,
  ShopOutlined,
  DownOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Image, Skeleton } from "antd";

import {
  loadEventDetail,
  loadEventFullData,
} from "@/services/core/eventService";
import { PlaceImageGallery } from "./PlaceImageGallery";

const EMPTY_ARRAY = [];

function getRelativeDate(date) {
  if (!date) return "";

  const reviewDate = new Date(date);
  const now = new Date();

  if (Number.isNaN(reviewDate.getTime())) return "";

  const diffMs = now - reviewDate;

  if (diffMs < 0) return "Just now";

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days < 1) return "Today";

  if (days === 1) return "1 day ago";

  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);

  if (months === 1) return "1 month ago";

  if (months < 12) return `${months} months ago`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 1 && remainingMonths === 0) {
    return "1 year ago";
  }

  if (remainingMonths === 0) {
    return `${years} years ago`;
  }

  return `${years} years ${remainingMonths} month${
    remainingMonths > 1 ? "s" : ""
  } ago`;
}

function formatNumber(value) {
  if (value == null || value === "") return "0";

  const number = Number(value);

  if (Number.isNaN(number)) return "0";

  return number.toLocaleString();
}

function formatDate(date) {
  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date) {
  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatSlug(slug) {
  if (!slug) return "";

  return slug.replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

function getAmenityIcon(iconSlug) {
  if (!iconSlug) {
    return <CheckCircleFilled />;
  }

  return <i className={`bi ${iconSlug}`} />;
}

function getInitials(name) {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
    0,
  )}`.toUpperCase();
}

function RatingStars({ rating = 0, size = "normal" }) {
  const value = Number(rating) || 0;

  return (
    <div className={`sw-place-rating-stars ${size === "small" ? "small" : ""}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span className="sw-place-rating-star" key={star}>
          <StarOutlined />

          <span
            className="sw-place-rating-star-fill"
            style={{
              width: `${Math.min(
                Math.max((value - (star - 1)) * 100, 0),
                100,
              )}%`,
            }}
          >
            <StarFilled />
          </span>
        </span>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="sw-place-details-skeleton">
      <Skeleton
        active
        paragraph={{
          rows: 2,
        }}
      />

      <div className="sw-place-skeleton-grid">
        <Skeleton active paragraph={{ rows: 1 }} />
        <Skeleton active paragraph={{ rows: 1 }} />
      </div>
    </div>
  );
}

export default function PlaceDetailsCard({
  place,
  open = false,
  categoryDrawerOpen = false,
  onClose,
  setLoadingDetails,
  loadingDetails,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const openGallery = (index = 0) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  useEffect(() => {
    if (!open || !place?.entity_id) {
      setTimeout(() => setData(null), 0);
      return;
    }

    let cancelled = false;

    const fetchDetails = async () => {
      setLoadingDetails(true);
      setError(false);
      setData(null);
      setActiveTab("overview");

      try {
        const response = await loadEventFullData({ dataId: place.entity_id });

        if (!cancelled) {
          setData(response?.data || response || null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load place details:", err);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoadingDetails(false);
        }
      }
    };

    fetchDetails();

    return () => {
      cancelled = true;
    };
  }, [open, place]);

  if (!open || !place) {
    setTimeout(() => setData(null), 0);
    return null;
  }

  return (
    <>
      <aside
        className={`sw-place-details-card ${
          categoryDrawerOpen
            ? "sw-place-details-card--drawer-open"
            : "sw-place-details-card--drawer-closed"
        }`}
      >
        {loadingDetails ? (
          <LoadingDetails onClose={onClose} />
        ) : error ? (
          <ErrorDetails onClose={onClose} />
        ) : (
          <LoadedDetails
            data={data}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onClose={onClose}
            setGalleryOpen={setGalleryOpen}
          />
        )}
      </aside>
      <PlaceImageGallery
        open={galleryOpen}
        medias={data?.medias || []}
        currentIndex={galleryIndex}
        title={data?.title || "Place"}
        onClose={() => setGalleryOpen(false)}
        onChange={setGalleryIndex}
      />
    </>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingDetails({ onClose }) {
  return (
    <>
      <div className="sw-place-details-hero sw-place-details-hero-loading">
        <Skeleton.Image active className="sw-place-details-image-skeleton" />

        <button
          type="button"
          className="sw-place-details-close"
          onClick={onClose}
          aria-label="Close place details"
        >
          <CloseOutlined />
        </button>
      </div>

      <div className="sw-place-details-loading-content">
        <Skeleton
          active
          title={{
            width: "72%",
          }}
          paragraph={{
            rows: 2,
            width: ["55%", "40%"],
          }}
        />

        <div className="sw-place-details-loading-stats">
          <Skeleton.Input active size="small" />
          <Skeleton.Input active size="small" />
          <Skeleton.Input active size="small" />
          <Skeleton.Input active size="small" />
        </div>

        <Skeleton active paragraph={{ rows: 1 }} />

        <div className="sw-place-details-loading-amenities">
          {[1, 2, 3, 4, 5].map((item) => (
            <Skeleton.Avatar key={item} active size="small" shape="circle" />
          ))}
        </div>

        <div className="sw-place-details-loading-tabs">
          <Skeleton.Input active size="small" />
          <Skeleton.Input active size="small" />
          <Skeleton.Input active size="small" />
        </div>

        <DetailSkeleton />
      </div>
    </>
  );
}

/* =========================================================
   ERROR
========================================================= */

function ErrorDetails({ onClose }) {
  return (
    <div className="sw-place-details-error">
      <button
        type="button"
        className="sw-place-details-close"
        onClick={onClose}
        aria-label="Close place details"
      >
        <CloseOutlined />
      </button>

      <div className="sw-place-error-icon">
        <InfoCircleOutlined />
      </div>

      <h3>Unable to load details</h3>

      <p>{`We couldn't load information about this place. Please try again.`}</p>
    </div>
  );
}

/* =========================================================
   LOADED DETAILS
========================================================= */

function LoadedDetails({
  data,
  activeTab,
  setActiveTab,
  onClose,
  setGalleryOpen,
}) {
  if (!data) {
    return (
      <div className="sw-place-details-empty">
        <InfoCircleOutlined />
        <span>No place information available.</span>
      </div>
    );
  }

  const medias = Array.isArray(data.medias) ? data.medias : EMPTY_ARRAY;
  const amenities = Array.isArray(data.amenities)
    ? data.amenities
    : EMPTY_ARRAY;

  const statistics = data.statistics || {};

  const rating = Number(statistics.average_rating) || 0;
  const reviewCount = Number(statistics.review_count) || 0;

  return (
    <>
      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="sw-place-details-hero">
        {medias.length > 0 ? (
          <>
            <div
              className="sw-place-details-image-wrapper"
              onClick={() => setGalleryOpen(true)}
            >
              <Image
                src={medias[0]?.url}
                alt={data.title || "Place"}
                className="sw-place-details-image"
                preview={false}
              />

              <div className="sw-place-image-preview-mask">
                <span>Click to preview</span>
              </div>

              {medias.length > 1 && (
                <div className="sw-place-image-count">
                  <PictureOutlined />
                  <span>{medias.length}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="sw-place-details-image-empty">
            <EnvironmentOutlined />
            <span>No photos available</span>
          </div>
        )}

        <div className="sw-place-details-hero-gradient" />

        <button
          type="button"
          className="sw-place-details-close"
          onClick={onClose}
        >
          <CloseOutlined />
        </button>
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="sw-place-details-header">
        <div className="sw-place-details-title-row">
          <div className="sw-place-details-title">
            <h1>{data.title || "Untitled"}</h1>

            {data.slug && (
              <span className="sw-place-details-slug">
                {formatSlug(data.slug)}
              </span>
            )}
          </div>

          {data.is_featured && (
            <span className="sw-place-featured">
              <StarFilled />
              Featured
            </span>
          )}
        </div>

        <div className="sw-place-details-category-row">
          {data.category_name && (
            <span className="sw-place-category">{data.category_name}</span>
          )}

          {data.sub_category_name && (
            <>
              <span className="sw-place-category-separator">•</span>

              <span className="sw-place-subcategory">
                {data.sub_category_name}
              </span>
            </>
          )}
        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="sw-place-details-stats">
          <div className="sw-place-stat rating">
            <StarFilled />

            <strong>{rating.toFixed(1)}</strong>

            <span>{formatNumber(reviewCount)}</span>
          </div>

          <div className="sw-place-stat">
            <EyeOutlined />
            <span>{formatNumber(statistics.view_count)}</span>
          </div>

          <div
            className={`sw-place-stat ${data.is_liked ? "active-like" : ""}`}
          >
            {data.is_liked ? <HeartFilled /> : <HeartOutlined />}

            <span>{formatNumber(statistics.like_count)}</span>
          </div>

          <div
            className={`sw-place-stat ${
              data.is_bookmarked ? "active-bookmark" : ""
            }`}
          >
            {data.is_bookmarked ? <CheckCircleFilled /> : <CheckCircleFilled />}

            <span>{formatNumber(statistics.bookmark_count)}</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          AMENITIES
      ===================================================== */}

      <div className="sw-place-amenities-wrapper">
        {amenities.length > 0 ? (
          <div className="sw-place-amenities" aria-label="Amenities">
            {amenities.map((amenity) => (
              <div
                key={amenity.id}
                className={`sw-place-amenity ${
                  amenity.is_provided_facility ? "provided" : "not-provided"
                }`}
                title={amenity.name}
              >
                {getAmenityIcon(amenity.icon_slug)}
              </div>
            ))}
          </div>
        ) : (
          <div className="sw-place-no-amenities">
            <span>No amenities listed</span>
          </div>
        )}
      </div>

      {/* =====================================================
          TABS
      ===================================================== */}

      <div className="sw-place-details-tabs">
        <button
          type="button"
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>

        <button
          type="button"
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
          {reviewCount > 0 && (
            <span className="sw-place-tab-count">
              {formatNumber(reviewCount)}
            </span>
          )}
        </button>

        <button
          type="button"
          className={activeTab === "about" ? "active" : ""}
          onClick={() => setActiveTab("about")}
        >
          About
        </button>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="sw-place-details-content">
        {activeTab === "overview" && <OverviewContent data={data} />}

        {activeTab === "reviews" && <ReviewsContent data={data} />}

        {activeTab === "about" && <AboutContent data={data} />}
      </div>
    </>
  );
}

/* =========================================================
   OVERVIEW
========================================================= */

function OverviewContent({ data }) {
  const hasLocation =
    data.address || data.latitude != null || data.longitude != null;

  const hasDate = data.start_date || data.end_date;

  const hasOwner = data.owner_name || data.owner_id;

  const hasDescription = Boolean(data.short_description || data.description);

  return (
    <div className="sw-place-overview">
      {/* EVENT INFORMATION */}

      {hasDate && (
        <section className="sw-place-section">
          <h3>Event information</h3>

          <div className="sw-place-info-grid">
            {data.start_date && (
              <div className="sw-place-info-item">
                <div className="sw-place-info-icon">
                  <CalendarOutlined />
                </div>

                <div>
                  <span>Starts</span>

                  <strong>{formatDate(data.start_date)}</strong>

                  <small>{formatTime(data.start_date)}</small>
                </div>
              </div>
            )}

            {data.end_date && (
              <div className="sw-place-info-item">
                <div className="sw-place-info-icon">
                  <ClockCircleOutlined />
                </div>

                <div>
                  <span>Ends</span>

                  <strong>{formatDate(data.end_date)}</strong>

                  <small>{formatTime(data.end_date)}</small>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* LOCATION */}

      {hasLocation && (
        <section className="sw-place-section">
          <h3>Location</h3>

          <div className="sw-place-location-card">
            <div className="sw-place-location-icon">
              <EnvironmentOutlined />
            </div>

            <div>
              {data.address && <strong>{data.address}</strong>}

              {data.latitude != null && data.longitude != null && (
                <small>
                  {Number(data.latitude).toFixed(5)},{" "}
                  {Number(data.longitude).toFixed(5)}
                </small>
              )}
            </div>
          </div>
        </section>
      )}

      {/* DESCRIPTION */}

      {hasDescription && (
        <section className="sw-place-section">
          <h3>About this place</h3>

          <p className="sw-place-description">
            {data.short_description || data.description}
          </p>
        </section>
      )}

      {/* OWNER */}

      {hasOwner && (
        <section className="sw-place-section">
          <h3>Provided by</h3>

          <div className="sw-place-owner">
            <div className="sw-place-owner-avatar">
              <UserOutlined />
            </div>

            <div>
              <span>Owner</span>

              <strong>{data.owner_name || "—"}</strong>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}

      {(data.phone || data.phone_number || data.website || data.email) && (
        <section className="sw-place-section">
          <h3>Contact</h3>

          <div className="sw-place-contact">
            {(data.phone || data.phone_number) && (
              <a href={`tel:${data.phone || data.phone_number}`}>
                <PhoneOutlined />

                <span>{data.phone || data.phone_number}</span>
              </a>
            )}

            {data.email && (
              <a href={`mailto:${data.email}`}>
                <GlobalOutlined />
                <span>{data.email}</span>
              </a>
            )}

            {data.website && (
              <a href={data.website} target="_blank" rel="noopener noreferrer">
                <GlobalOutlined />
                <span>{data.website}</span>
              </a>
            )}
          </div>
        </section>
      )}

      {!hasDate &&
        !hasLocation &&
        !hasDescription &&
        !hasOwner &&
        !data.phone &&
        !data.phone_number &&
        !data.website &&
        !data.email && (
          <EmptySection message="No overview information available." />
        )}
    </div>
  );
}

/* =========================================================
   REVIEWS
========================================================= */

function ReviewsContent({ data }) {
  const statistics = data.statistics || {};

  const reviews = Array.isArray(data.reviews) ? data.reviews : EMPTY_ARRAY;

  const rating = Number(statistics.average_rating) || 0;

  const ratingDistribution = useMemo(() => {
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      const value = Number(review.rating);

      if (value >= 1 && value <= 5) {
        distribution[Math.round(value)] += 1;
      }
    });

    return distribution;
  }, [reviews]);

  const reviewCount = Number(statistics.review_count) || reviews.length || 0;

  return (
    <div className="sw-place-reviews">
      {/* REVIEW SUMMARY */}

      <div className="sw-reviews-summary">
        <div className="sw-rating-overall">
          <strong>{rating > 0 ? rating.toFixed(1) : "—"}</strong>

          <RatingStars rating={rating} />

          <span>
            {formatNumber(reviewCount)}{" "}
            {reviewCount === 1 ? "review" : "reviews"}
          </span>
        </div>

        <div className="sw-rating-breakdown">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star];

            const percentage =
              reviewCount > 0 ? (count / reviewCount) * 100 : 0;

            return (
              <div className="sw-rating-row" key={star}>
                <span className="sw-rating-number">{star}</span>

                <StarFilled className="sw-rating-row-star" />

                <div className="sw-rating-bar">
                  <span
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span className="sw-rating-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* REVIEW LIST */}

      {reviews.length > 0 ? (
        <div className="sw-review-list">
          {reviews.map((review) => {
            const name = review.user_name || review.name || "Anonymous";

            return (
              <div className="sw-review-item" key={review.id}>
                <div className="sw-review-header">
                  <div className="sw-review-avatar">{getInitials(name)}</div>

                  <div className="sw-review-user">
                    <strong>{name}</strong>

                    <div className="sw-review-meta">
                      <div className="sw-review-item-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarFilled
                            key={star}
                            className={
                              star <= Number(review.rating) ? "filled" : ""
                            }
                          />
                        ))}
                      </div>

                      {review.created_at && (
                        <span className="sw-review-date">
                          {getRelativeDate(review.created_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {review.comment && (
                  <p className="sw-review-comment">{review.comment}</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptySection message="No reviews yet." />
      )}
    </div>
  );
}

/* =========================================================
   ABOUT
========================================================= */

function AboutContent({ data }) {
  const hasBasicInformation =
    data.entity_type_name ||
    data.status_name ||
    data.event_status_name ||
    data.venue_type_name ||
    data.category_name ||
    data.sub_category_name;

  return (
    <div className="sw-place-about">
      {data.description && (
        <section className="sw-place-section">
          <h3>About {data.title}</h3>

          <p className="sw-place-description">{data.description}</p>
        </section>
      )}

      {hasBasicInformation && (
        <section className="sw-place-section">
          <h3>Details</h3>

          <div className="sw-place-about-grid">
            {data.entity_type_name && (
              <AboutItem label="Type" value={data.entity_type_name} />
            )}

            {data.status_name && (
              <AboutItem label="Status" value={data.status_name} />
            )}

            {data.event_status_name && (
              <AboutItem label="Event status" value={data.event_status_name} />
            )}

            {data.venue_type_name && (
              <AboutItem label="Venue" value={data.venue_type_name} />
            )}

            {data.category_name && (
              <AboutItem label="Category" value={data.category_name} />
            )}

            {data.sub_category_name && (
              <AboutItem label="Sub-category" value={data.sub_category_name} />
            )}
          </div>
        </section>
      )}

      {data.created_at && (
        <section className="sw-place-section">
          <h3>Information</h3>

          <div className="sw-place-about-meta">
            <span>Added</span>
            <strong>{formatDate(data.created_at)}</strong>
          </div>

          {data.updated_at && (
            <div className="sw-place-about-meta">
              <span>Last updated</span>
              <strong>{formatDate(data.updated_at)}</strong>
            </div>
          )}
        </section>
      )}

      {!data.description && !hasBasicInformation && !data.created_at && (
        <EmptySection message="No additional information available." />
      )}
    </div>
  );
}

function AboutItem({ label, value }) {
  return (
    <div className="sw-place-about-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptySection({ message }) {
  return (
    <div className="sw-place-empty-section">
      <InfoCircleOutlined />
      <span>{message}</span>
    </div>
  );
}
