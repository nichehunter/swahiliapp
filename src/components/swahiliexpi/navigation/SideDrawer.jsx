"use client";

import { getFirstWord, getInitials, toTitleCase } from "@/libs/utils/char";
import {
  EnvironmentOutlined,
  CoffeeOutlined,
  BookOutlined,
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
import { useAuthStore } from "@/stores/authStore";
import { Avatar } from "antd";
import Image from "next/image";
import { useMemo, useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
  };

  const handleSignIn = () => {
    setAuthModalOpen(true);
  };

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
            key: "bookmarks",
            label: "Bookmarks",
            icon: <i className="bi bi-bookmark" />,
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

  const displayName = user?.first_name || "Account";
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
                        onNavigate?.(item);
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
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                className="sw-drawer-signin"
                onClick={() => {
                  handleSignIn();
                  onClose?.();
                }}
              >
                <LoginOutlined />
                <span>Sign in / Create account</span>
              </button>

              <div className="sw-drawer-footer-text">
                Discover Tanzania with SwahiliExpi
              </div>
            </>
          ) : (
            <>
              <div className="sw-drawer-account">
                <button
                  type="button"
                  className="sw-drawer-account-profile"
                  onClick={() => {
                    onNavigate?.("profile");
                    onClose?.();
                  }}
                >
                  <Avatar
                    src={user?.avatar_url}
                    size={42}
                    className="sw-drawer-account-avatar"
                  >
                    {getInitials(getFirstWord(displayName))}
                  </Avatar>

                  <span className="sw-drawer-account-info">
                    <strong>{toTitleCase(getFirstWord(displayName))}</strong>
                    <small>View your profile</small>
                  </span>

                  <span className="sw-drawer-account-arrow">
                    <EnvironmentOutlined />
                  </span>
                </button>

                <div className="sw-drawer-account-actions">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate?.("settings");
                      onClose?.();
                    }}
                  >
                    <SettingOutlined />
                    <span>Account settings</span>
                  </button>

                  <button
                    type="button"
                    className="logout"
                    onClick={() => {
                      logout();
                      onClose?.();
                    }}
                  >
                    <LoginOutlined />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>

              <div className="sw-drawer-footer-text">
                Discover Tanzania with SwahiliExpi
              </div>
            </>
          )}
        </div>
      </aside>
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
