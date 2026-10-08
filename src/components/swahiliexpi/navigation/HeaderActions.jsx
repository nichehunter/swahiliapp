"use client";

import { useState } from "react";
import { HeartOutlined, UserOutlined, MenuOutlined } from "@ant-design/icons";

import AuthModal from "@/components/auth/AuthModal";
import AccountDropdown from "@/components/auth/AccountDropdown";

import "@/styles/auth/headeraction.css";
import { useAuthStore } from "@/stores/authStore";

export default function HeaderActions({
  onSaved,
  onProfile,
  onLiked,
  onSettings,
  setAuthModalOpen,
  authModalOpen = false,
}) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleSignIn = () => {
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="sw-header-actions">
        {!isAuthenticated ? (
          <button
            type="button"
            className="sw-header-button"
            onClick={handleSignIn}
          >
            <UserOutlined />

            <span>Sign in</span>
          </button>
        ) : (
          <AccountDropdown
            user={user}
            onProfile={onProfile}
            onSaved={onSaved}
            onLiked={onLiked}
            onSettings={onSettings}
            onSignOut={handleLogout}
          />
        )}
      </div>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
