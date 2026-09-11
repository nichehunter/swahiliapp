"use client";

import { toTitleCase } from "@/libs/utils/char";
import {
  CompassOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  CoffeeOutlined,
  CameraOutlined,
  HeartOutlined,
  HistoryOutlined,
  ShoppingOutlined,
  FireOutlined,
  StarOutlined,
  AimOutlined,
  UserOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LoginOutlined,
  CloseOutlined,
  TrophyOutlined,
  ShopOutlined,
  TeamOutlined,
  BankOutlined,
  CustomerServiceOutlined,
  SmileOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { useMemo } from "react";

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

export default function SideDrawer({
  open = false,
  onClose,
  activeItem = "explore",
  onNavigate,
  onSignIn,
  categories,
  onCategoryChange,
}) {
  const menuSections = useMemo(() => {
    const categoryItems = (categories || []).map((category) => {
      const name = category.dictionary_item_name?.trim() || "Category";
      const normalizedName = name.toLowerCase();

      const Icon = CATEGORY_ICONS[normalizedName] || EnvironmentOutlined;

      return {
        key: `category-${category.id}`,
        label: name,
        icon: <Icon />,
        category,
      };
    });

    return [
      {
        title: "Categories",
        items: categoryItems,
      },

      {
        title: "Your Activity",
        items: [
          {
            key: "saved",
            label: "Saved",
            icon: <HeartOutlined />,
          },
          {
            key: "recent",
            label: "Recently Viewed",
            icon: <HistoryOutlined />,
          },
          {
            key: "bookings",
            label: "My Bookings",
            icon: <ShoppingOutlined />,
          },
        ],
      },

      {
        title: "Discover",
        items: [
          {
            key: "trending",
            label: "Trending Now",
            icon: <FireOutlined />,
          },
          {
            key: "featured",
            label: "Featured",
            icon: <StarOutlined />,
          },
          {
            key: "nearby",
            label: "Near Me",
            icon: <AimOutlined />,
          },
        ],
      },

      {
        title: "Account",
        items: [
          {
            key: "profile",
            label: "Profile",
            icon: <UserOutlined />,
          },
          {
            key: "settings",
            label: "Settings",
            icon: <SettingOutlined />,
          },
          {
            key: "help",
            label: "Help & Support",
            icon: <QuestionCircleOutlined />,
          },
        ],
      },
    ];
  }, [categories]);
  return (
    <>
      {/* OVERLAY */}
      <div
        className={`sw-drawer-overlay ${open ? "open" : ""}`}
        onClick={onClose}
      />

      {/* DRAWER */}
      <aside className={`sw-side-drawer ${open ? "open" : ""}`}>
        {/* HEADER */}
        <div className="sw-drawer-header">
          <div className="sw-drawer-brand">
            <Image
              src="/assets/logo/logo1.png"
              alt="SwahiliExpi"
              width={140}
              height={40}
              className="sw-drawer-logo"
              priority
            />
          </div>

          <button
            type="button"
            className="sw-drawer-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* MENU */}
        <div className="sw-drawer-content">
          {menuSections.map((section) => (
            <div className="sw-drawer-section" key={section.title}>
              <div className="sw-drawer-section-title">{section.title}</div>

              <div className="sw-drawer-items">
                {section.items.map((item) => (
                  <button
                    type="button"
                    key={item.key}
                    className={`sw-drawer-item ${
                      activeItem === item.key ? "active" : ""
                    }`}
                    onClick={() => {
                      if (item.category) {
                        onCategoryChange?.(item.category);
                      } else {
                        onNavigate?.(item.key);
                      }

                      onClose?.();
                    }}
                  >
                    <span className="sw-drawer-item-icon">{item.icon}</span>

                    <span className="sw-drawer-item-label">
                      {toTitleCase(item.label)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="sw-drawer-footer">
          <button type="button" className="sw-drawer-signin" onClick={onSignIn}>
            <LoginOutlined />
            <span>Sign in / Create account</span>
          </button>

          <div className="sw-drawer-footer-text">
            Discover Tanzania with SwahiliExpi
          </div>
        </div>
      </aside>
    </>
  );
}
