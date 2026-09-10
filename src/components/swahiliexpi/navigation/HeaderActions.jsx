"use client";

import { HeartOutlined, UserOutlined, MenuOutlined } from "@ant-design/icons";

export default function HeaderActions({ onSaved, onSignIn, onMenu }) {
  return (
    <>
      <div className="sw-header-actions">
        <button type="button" className="sw-header-button" onClick={onSignIn}>
          <UserOutlined />

          <span>Sign in</span>
        </button>
      </div>
    </>
  );
}
