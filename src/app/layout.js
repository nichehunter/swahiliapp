import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/styles/common/notification.css";
import "@/styles/common/skeleton.css";

import { NotificationProvider } from "@/components/common/notification/NotificationProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="theme-color" content="#000000" />

        <meta name="description" content="SwahiliExpi Platform" />

        <title>SwahiliExpi</title>
      </head>
      <body>
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
