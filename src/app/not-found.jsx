"use client";

import {
  ArrowLeftOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  CalendarOutlined,
  CoffeeOutlined,
  CameraOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import "@/styles/notfound.css";

const QUICK_LINKS = [
  {
    label: "Explore",
    href: "/",
    icon: CompassOutlined,
  },
  {
    label: "Events",
    href: "/events",
    icon: CalendarOutlined,
  },
  {
    label: "Hotels",
    href: "/hotels",
    icon: HomeOutlined,
  },
  {
    label: "Food",
    href: "/restaurants",
    icon: CoffeeOutlined,
  },
  {
    label: "Beaches",
    href: "/beaches",
    icon: EnvironmentOutlined,
  },
  {
    label: "Tours",
    href: "/tours",
    icon: CameraOutlined,
  },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="sw-404-page">
      {/* Background decoration */}
      <div className="sw-404-glow sw-404-glow-one" />
      <div className="sw-404-glow sw-404-glow-two" />

      <div className="sw-404-container">
        {/* Brand */}
        <button
          type="button"
          className="sw-404-brand"
          onClick={() => router.push("/")}
          aria-label="Go to SwahiliExpi home"
        >
          <span className="sw-404-brand-mark">S</span>

          <span className="sw-404-brand-name">
            Swahili<span>Expi</span>
          </span>
        </button>

        {/* Main content */}
        <section className="sw-404-content">
          {/* Illustration */}
          <div className="sw-404-visual" aria-hidden="true">
            <div className="sw-404-compass">
              <CompassOutlined />
            </div>

            <div className="sw-404-route">
              <span className="sw-route-line sw-route-line-one" />
              <span className="sw-route-line sw-route-line-two" />

              <span className="sw-route-dot sw-route-start">
                <EnvironmentOutlined />
              </span>

              <span className="sw-route-dot sw-route-end">
                <EnvironmentOutlined />
              </span>
            </div>

            <div className="sw-404-number">404</div>
          </div>

          {/* Copy */}
          <div className="sw-404-copy">
            <span className="sw-404-eyebrow">
              <span className="sw-404-eyebrow-dot" />
              Destination not found
            </span>

            <h1>
              {`Looks like you've`}
              <br />
              <span>wandered off the map.</span>
            </h1>

            <p>
              The page you’re looking for may have moved, expired, or no longer
              exists. But there are plenty of amazing places waiting to be
              discovered.
            </p>

            {/* Actions */}
            <div className="sw-404-actions">
              <button
                type="button"
                className="sw-404-primary"
                onClick={() => router.push("/")}
              >
                <CompassOutlined />
                <span>Explore SwahiliExpi</span>
                <ArrowRightOutlined />
              </button>

              <button
                type="button"
                className="sw-404-secondary"
                onClick={() => router.back()}
              >
                <ArrowLeftOutlined />
                <span>Go back</span>
              </button>
            </div>
          </div>
        </section>

        {/* Quick navigation */}
        <section className="sw-404-discover">
          <div className="sw-404-discover-heading">
            <div>
              <span>KEEP EXPLORING</span>
              <h2>Where would you like to go?</h2>
            </div>

            <div className="sw-404-discover-line" />
          </div>

          <div className="sw-404-links">
            {QUICK_LINKS.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  className="sw-404-link"
                  onClick={() => router.push(item.href)}
                >
                  <span className="sw-404-link-icon">
                    <Icon />
                  </span>

                  <span className="sw-404-link-label">{item.label}</span>

                  <ArrowRightOutlined className="sw-404-link-arrow" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="sw-404-footer">
          <span>Discover Tanzania. Experience Zanzibar. Live the moment.</span>
          <span className="sw-404-footer-dot">•</span>
          <span>SwahiliExpi</span>
        </footer>
      </div>
    </main>
  );
}
