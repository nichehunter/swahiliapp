"use client";

import { toSmartTitleCase } from "@/libs/utils/char";
import { fNumberPoint, fNumber } from "@/libs/utils/number";

import {
  StarFilled,
  SaveOutlined,
  ShareAltOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Image } from "antd";

export default function MapPopup({ place }) {
  if (!place) return null;

  return (
    <div className="sw-map-popup">
      <div className="sw-popup-image">
        <Image
          src={place.image_url}
          alt={place.title}
          sizes="280px"
          className="sw-popup-image-img"
        />
      </div>

      <div className="sw-popup-content">
        <div className="sw-popup-top">
          <div className="sw-popup-info">
            <div className="sw-popup-category">{place.category_name}</div>

            <h4>{toSmartTitleCase(place.title)}</h4>

            <div className="sw-popup-rating">
              <StarFilled />
              <strong>{fNumberPoint(place.average_rating)}</strong>

              {<span>({fNumber(place.total_reviews)})</span>}
            </div>
          </div>

          {/* <div className="sw-popup-actions">
            <button
              type="button"
              className="sw-popup-action"
              aria-label="Save"
              title="Save"
            >
              <i className="bi bi-bookmark" />
            </button>

            <button
              type="button"
              className="sw-popup-action"
              aria-label="Share"
              title="Share"
            >
              <ShareAltOutlined />
            </button>

            <button
              type="button"
              className="sw-popup-action"
              aria-label="Like"
              title="Like"
            >
              <HeartOutlined />
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
