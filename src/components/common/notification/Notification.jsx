"use client";

import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
  CloseOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";

const NOTIFICATION_CONFIG = {
  success: {
    icon: CheckCircleFilled,
    className: "success",
  },
  error: {
    icon: CloseCircleFilled,
    className: "error",
  },
  warning: {
    icon: ExclamationCircleFilled,
    className: "warning",
  },
  info: {
    icon: InfoCircleFilled,
    className: "info",
  },
};

export default function Notification({
  type = "info",
  title,
  message,
  duration = 4000,
  onClose,
}) {
  const config = NOTIFICATION_CONFIG[type] || NOTIFICATION_CONFIG.info;

  const Icon = config.icon;

  useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`sw-notification ${config.className}`}>
      <div className="sw-notification-icon">
        <Icon />
      </div>

      <div className="sw-notification-content">
        {title && <div className="sw-notification-title">{title}</div>}

        {message && <div className="sw-notification-message">{message}</div>}
      </div>

      <button
        type="button"
        className="sw-notification-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <CloseOutlined />
      </button>
    </div>
  );
}
