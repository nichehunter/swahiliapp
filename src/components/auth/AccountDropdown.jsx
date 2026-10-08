"use client";
import { getFirstWord, getInitials, toTitleCase } from "@/libs/utils/char";
import {
  UserOutlined,
  HeartOutlined,
  BookOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Dropdown, Avatar } from "antd";

import "@/styles/auth/accountdropdown.css";

export default function AccountDropdown({
  user,
  onProfile,
  onSaved,
  onLiked,
  onSettings,
  onSignOut,
}) {
  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "saved",
      icon: <BookOutlined />,
      label: "Saved places",
    },
    {
      key: "liked",
      icon: <HeartOutlined />,
      label: "Liked events",
    },
    {
      type: "divider",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign out",
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "profile":
        onProfile?.();
        break;

      case "saved":
        onSaved?.();
        break;

      case "liked":
        onLiked?.();
        break;

      case "settings":
        onSettings?.();
        break;

      case "logout":
        onSignOut?.();
        break;

      default:
        break;
    }
  };

  const displayName = user?.first_name || "Account";

  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: handleMenuClick,
      }}
      trigger={["click"]}
      placement="bottomRight"
      classNames={{
        root: "sw-account-dropdown",
      }}
    >
      <button type="button" className="sw-account-button">
        <Avatar
          src={user?.avatar_url}
          alt={displayName}
          className="sw-account-avatar"
        >
          {getInitials(getFirstWord(displayName))}
        </Avatar>

        <span className="sw-account-name">
          {toTitleCase(getFirstWord(displayName))}
        </span>

        <DownOutlined className="sw-account-arrow" />
      </button>
    </Dropdown>
  );
}
