"use client";

import Image from "next/image";
import { MenuOutlined } from "@ant-design/icons";

export default function Brand({
  onClick,
  onMenu,
  logoSrc = "/assets/logo/logo.png",
  mobileLogoSrc = "/assets/logo/icon.png",
}) {
  return (
    <div className="sw-brand-container">
      <button
        type="button"
        className="sw-brand-menu"
        onClick={onMenu}
        aria-label="Open menu"
      >
        <MenuOutlined />
      </button>

      <button
        type="button"
        className="sw-brand"
        onClick={onClick}
        aria-label="SwahiliExpi home"
      >
        {/* Desktop logo */}
        <Image
          src={logoSrc}
          alt="SwahiliExpi"
          width={140}
          height={40}
          className="sw-brand-logo sw-brand-logo-desktop"
          priority
        />

        {/* Mobile S logo */}
        <Image
          src={mobileLogoSrc}
          alt="SwahiliExpi"
          width={40}
          height={40}
          className="sw-brand-logo sw-brand-logo-mobile"
          priority
        />
      </button>
    </div>
  );
}
