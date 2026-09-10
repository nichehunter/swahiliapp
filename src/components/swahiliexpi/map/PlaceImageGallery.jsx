"use client";

import { useEffect } from "react";
import {
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Image } from "antd";

export const PlaceImageGallery = ({
  open,
  medias = [],
  currentIndex = 0,
  title = "Place",
  onClose,
  onChange,
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();

        onChange(currentIndex === 0 ? medias.length - 1 : currentIndex - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();

        onChange(currentIndex === medias.length - 1 ? 0 : currentIndex + 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, currentIndex, medias.length, onClose, onChange]);

  if (!open || !medias.length) {
    return null;
  }

  const currentMedia = medias[currentIndex];

  const goPrevious = (event) => {
    event.stopPropagation();

    onChange(currentIndex === 0 ? medias.length - 1 : currentIndex - 1);
  };

  const goNext = (event) => {
    event.stopPropagation();

    onChange(currentIndex === medias.length - 1 ? 0 : currentIndex + 1);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="sw-place-gallery"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      onClick={handleOverlayClick}
    >
      <div className="sw-place-gallery-header">
        <div className="sw-place-gallery-title">
          <PictureOutlined />

          <span>{title}</span>
        </div>

        <div className="sw-place-gallery-counter">
          {currentIndex + 1} / {medias.length}
        </div>

        <button
          type="button"
          className="sw-place-gallery-close"
          onClick={onClose}
          aria-label="Close photos"
        >
          <CloseOutlined />
        </button>
      </div>

      <div className="sw-place-gallery-stage">
        {medias.length > 1 && (
          <button
            type="button"
            className="sw-place-gallery-arrow sw-place-gallery-arrow-left"
            onClick={goPrevious}
            aria-label="Previous photo"
          >
            <LeftOutlined />
          </button>
        )}

        <div className="sw-place-gallery-image-wrapper">
          <Image
            src={currentMedia?.url}
            alt={`${title} ${currentIndex + 1}`}
            className="sw-place-gallery-image"
          />
        </div>

        {medias.length > 1 && (
          <button
            type="button"
            className="sw-place-gallery-arrow sw-place-gallery-arrow-right"
            onClick={goNext}
            aria-label="Next photo"
          >
            <RightOutlined />
          </button>
        )}
      </div>

      {medias.length > 1 && (
        <div className="sw-place-gallery-thumbnails">
          {medias.map((media, index) => (
            <button
              key={`${media?.url}-${index}`}
              type="button"
              className={`sw-place-gallery-thumbnail ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={() => onChange(index)}
              aria-label={`View photo ${index + 1}`}
            >
              <Image src={media?.url} alt="" preview={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
