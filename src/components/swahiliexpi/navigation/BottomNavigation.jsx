"use client";

import {
  CompassOutlined,
  CalendarOutlined,
  HeartOutlined,
  UserOutlined,
} from "@ant-design/icons";

const DEFAULT_ITEMS = [
  {
    key: "explore",
    label: "Explore",
    icon: <CompassOutlined />,
  },
  {
    key: "events",
    label: "Events",
    icon: <CalendarOutlined />,
  },
  {
    key: "saved",
    label: "Saved",
    icon: <HeartOutlined />,
  },
  {
    key: "profile",
    label: "Profile",
    icon: <UserOutlined />,
  },
];

export default function BottomNavigation({
  items = DEFAULT_ITEMS,
  activeItem = "explore",
  onChange,
}) {
  return (
    <nav className="sw-bottom-nav">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={activeItem === item.key ? "active" : ""}
          onClick={() => onChange?.(item.key)}
        >
          <span className="sw-bottom-icon">{item.icon}</span>

          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
