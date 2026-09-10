"use client";

import { createContext, useCallback, useContext, useState } from "react";

import Notification from "./Notification";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const showNotification = useCallback(
    ({ type = "info", title, message, duration = 4000 }) => {
      const id = `${Date.now()}-${Math.random()}`;

      setNotifications((current) => [
        ...current,
        {
          id,
          type,
          title,
          message,
          duration,
        },
      ]);

      return id;
    },
    [],
  );

  const notify = {
    success: (title, message, options = {}) =>
      showNotification({
        type: "success",
        title,
        message,
        ...options,
      }),

    error: (title, message, options = {}) =>
      showNotification({
        type: "error",
        title,
        message,
        ...options,
      }),

    warning: (title, message, options = {}) =>
      showNotification({
        type: "warning",
        title,
        message,
        ...options,
      }),

    info: (title, message, options = {}) =>
      showNotification({
        type: "info",
        title,
        message,
        ...options,
      }),
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}

      <div className="sw-notification-container">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    // Return dummy no-op functions during SSR / static build to prevent build errors
    if (typeof window === "undefined") {
      return {
        success: () => {},
        error: () => {},
        info: () => {},
        warning: () => {},
        open: () => {},
        destroy: () => {},
      };
    }

    throw new Error("useNotification must be used inside NotificationProvider");
  }

  return context;
}
