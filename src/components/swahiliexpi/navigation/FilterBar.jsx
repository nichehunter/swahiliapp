"use client";

import { DownOutlined, StarFilled } from "@ant-design/icons";
import { useState } from "react";

const FILTERS = {
  rating: {
    label: "Rating",
    options: [
      { value: "", label: "Any rating" },
      { value: "4", label: "4+ stars" },
      { value: "4.5", label: "4.5+ stars" },
      { value: "5", label: "5 stars" },
    ],
  },

  price: {
    label: "Price",
    options: [
      { value: "", label: "Any price" },
      { value: "low", label: "Budget" },
      { value: "medium", label: "Moderate" },
      { value: "high", label: "Premium" },
    ],
  },

  availability: {
    label: "Availability",
    options: [
      { value: "", label: "Any time" },
      { value: "now", label: "Available now" },
      { value: "today", label: "Today" },
      { value: "week", label: "This week" },
    ],
  },

  distance: {
    label: "Distance",
    options: [
      { value: "", label: "Any distance" },
      { value: "1", label: "Within 1 km" },
      { value: "5", label: "Within 5 km" },
      { value: "10", label: "Within 10 km" },
    ],
  },
};

export default function FilterBar({
  filters = FILTERS,
  values = {},
  onChange,
}) {
  const [openFilter, setOpenFilter] = useState(null);

  const handleToggle = (key) => {
    setOpenFilter((current) => (current === key ? null : key));
  };

  const handleSelect = (key, value) => {
    onChange?.(key, value);
    setOpenFilter(null);
  };

  return (
    <div className="sw-filter-bar">
      {Object.entries(filters).map(([key, filter]) => {
        const selectedValue = values[key];

        const selectedOption = filter.options.find(
          (option) => option.value === selectedValue,
        );

        const isActive = selectedValue !== undefined && selectedValue !== "";

        return (
          <div className="sw-filter-item" key={key}>
            <button
              type="button"
              className={`sw-filter-button ${isActive ? "active" : ""}`}
              onClick={() => handleToggle(key)}
            >
              {key === "rating" && <StarFilled className="sw-filter-icon" />}

              <span>
                {isActive
                  ? selectedOption?.label || filter.label
                  : filter.label}
              </span>

              <DownOutlined
                className={`sw-filter-arrow ${
                  openFilter === key ? "open" : ""
                }`}
              />
            </button>

            {openFilter === key && (
              <div className="sw-filter-dropdown">
                {filter.options.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={`sw-filter-option ${
                      selectedValue === option.value ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(key, option.value)}
                  >
                    {key === "rating" && option.value && <StarFilled />}

                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
