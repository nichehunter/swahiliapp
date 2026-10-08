"use client";

import { useEffect, useRef, useState } from "react";
import {
  CloseOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Modal, Input } from "antd";
import { useAuthStore } from "@/stores/authStore";
import { useNotification } from "@/components/common/notification/NotificationProvider";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import "@/styles/auth/authmodal.css";
import { loginGoogle, registration, login } from "@/services/auth/authService";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const signInSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Email address is required."),

  password: Yup.string().required("Password is required."),
});

const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .required("Full name is required."),

  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Email address is required."),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .required("Password is required."),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match.")
    .required("Please confirm your password."),
});

export default function AuthModal({ open, onClose, onSuccess }) {
  const [mode, setMode] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const notify = useNotification();
  const googleButtonRef = useRef(null);
  const isSignIn = mode === "signin";

  const validationSchema = isSignIn ? signInSchema : registerSchema;

  const handleGoogleResponse = async (response) => {
    if (!response?.credential) {
      setGoogleLoading(false);

      notify.error(
        "Authentication Cancelled",
        "Google sign in was cancelled or could not be completed.",
      );

      return;
    }

    const payload = {
      credential: response.credential,
    };

    try {
      setGoogleLoading(true);
      setLoading(true);

      const result = await loginGoogle(payload);

      setAuth({
        user: result?.user,
      });

      notify.success(
        "Authentication Successful",
        "You have successfully signed in with Google.",
      );

      onSuccess?.();
      onClose?.();
      setMode("signin");
    } catch (error) {
      const responseData = error?.response?.data;

      let errorMessage = "Something went wrong. Please try again.";

      if (typeof responseData === "string") {
        errorMessage = responseData;
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      } else if (responseData?.detail) {
        errorMessage = responseData.detail;
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (typeof responseData === "object" && responseData) {
        const firstKey = Object.keys(responseData)[0];
        const firstError = responseData[firstKey];

        if (Array.isArray(firstError)) {
          errorMessage = `${firstError[0]}`;
        }
      }

      notify.error("Authentication Error", errorMessage);
    } finally {
      setLoading(false);
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    if (!GOOGLE_CLIENT_ID) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.");
      return;
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) return;

      // 1. Initialize Google Identity
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false, // Bypasses FedCM block on custom button clicks
      });

      // 2. Render Google's native hidden button inside our hidden ref container
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
        });
      }
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", initializeGoogle, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.head.appendChild(script);
  }, [open]);

  const handleGoogleLogin = () => {
    if (!window.google?.accounts?.id) {
      notify.error(
        "Authentication Error",
        "Google Sign-In is still loading. Please try again.",
      );
      return;
    }

    setGoogleLoading(true);

    const googleBtnEl =
      googleButtonRef.current?.querySelector('[role="button"]');

    if (googleBtnEl) {
      googleBtnEl.click();
    } else {
      window.google.accounts.id.prompt();
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setGoogleLoading(true);
    try {
      const payload = isSignIn
        ? {
            email: values.email.trim(),
            password: values.password,
          }
        : {
            full_name: values.name.trim(),
            email: values.email.trim(),
            password: values.password,
          };

      const result = isSignIn
        ? await login(payload)
        : await registration(payload);

      setAuth({
        user: result?.user,
      });

      notify.success(
        isSignIn ? "Welcome back" : "Account created",
        isSignIn
          ? "You have successfully signed in."
          : "Your SwahiliExpi account has been created successfully.",
      );

      onSuccess?.();
      onClose?.();
      setMode("signin");
    } catch (error) {
      const responseData = error?.response?.data;

      let errorMessage = "Something went wrong. Please try again.";

      if (typeof responseData === "string") {
        errorMessage = responseData;
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      } else if (responseData?.detail) {
        errorMessage = responseData.detail;
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (typeof responseData === "object" && responseData) {
        const firstKey = Object.keys(responseData)[0];
        const firstError = responseData[firstKey];

        if (Array.isArray(firstError)) {
          errorMessage = firstError[0];
        } else if (typeof firstError === "string") {
          errorMessage = firstError;
        }
      }

      notify.error(
        isSignIn ? "Sign In Failed" : "Registration Failed",
        errorMessage,
      );
    } finally {
      setLoading(false);
      setGoogleLoading(false);
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode((previous) => (previous === "signin" ? "register" : "signin"));
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        if (googleLoading || loading) return;

        onClose?.();
      }}
      closable={!googleLoading && !loading}
      footer={null}
      centered
      width={430}
      closeIcon={<CloseOutlined />}
      className="sw-auth-modal"
      destroyOnHidden
    >
      <div className="sw-auth-content">
        <div className="sw-auth-header">
          <div className="sw-auth-logo">
            <span>S</span>
          </div>
          <h2>{isSignIn ? "Welcome back" : "Join SwahiliExpi"}</h2>
          <p>
            {isSignIn
              ? "Sign in to continue exploring Tanzania."
              : "Create an account to get more from SwahiliExpi."}
          </p>
        </div>

        {/* Hidden Google Container */}
        <div ref={googleButtonRef} style={{ display: "none" }} />

        {/* Custom Styled Google Button */}
        <button
          type="button"
          className="sw-google-button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <span className="sw-google-icon" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.51 5.51 0 0 1-2.39 3.62v3.01h3.87c2.27-2.09 3.56-5.17 3.56-8.66Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3.01c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.95H1.28v3.1A12 12 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.28A7.24 7.24 0 0 1 4.9 12c0-.79.14-1.56.38-2.28v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.38l4-3.1Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.77c1.76 0 3.34.61 4.59 1.81l3.44-3.44C17.94 1.18 15.24 0 12 0A12 12 0 0 0 1.28 6.62l4 3.1C5.23 6.88 7.88 4.77 12 4.77Z"
              />
            </svg>
          </span>
          <span>
            {isSignIn ? "Sign in with Google" : "Create account with Google"}
          </span>
        </button>

        <div className="sw-auth-divider">
          <span>or</span>
        </div>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form className="sw-auth-form">
              {!isSignIn && (
                <div className="sw-auth-field">
                  <label>
                    Full name <span className="text-danger">*</span>
                  </label>

                  <Input
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Enter your full name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    status={touched.name && errors.name ? "error" : ""}
                  />

                  {touched.name && errors.name && (
                    <div className="sw-auth-error">{errors.name}</div>
                  )}
                </div>
              )}

              <div className="sw-auth-field">
                <label>
                  Email address <span className="text-danger">*</span>
                </label>

                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  status={touched.email && errors.email ? "error" : ""}
                />

                {touched.email && errors.email && (
                  <div className="sw-auth-error">{errors.email}</div>
                )}
              </div>

              <div className="sw-auth-field">
                <label>
                  Password <span className="text-danger">*</span>
                </label>

                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  status={touched.password && errors.password ? "error" : ""}
                />

                {touched.password && errors.password && (
                  <div className="sw-auth-error">{errors.password}</div>
                )}
              </div>

              {!isSignIn && (
                <div className="sw-auth-field">
                  <label>
                    Confirm password <span className="text-danger">*</span>
                  </label>

                  <Input.Password
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Confirm your password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    status={
                      touched.confirmPassword && errors.confirmPassword
                        ? "error"
                        : ""
                    }
                  />

                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="sw-auth-error">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              )}

              {isSignIn && (
                <div className="sw-forgot-password">
                  <button
                    type="button"
                    onClick={() => console.log("Forgot password")}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="sw-auth-submit"
                disabled={loading || isSubmitting}
              >
                {loading
                  ? "Please wait..."
                  : isSignIn
                    ? "Sign in"
                    : "Create account"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="sw-auth-switch">
          <span>
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button type="button" onClick={switchMode} disabled={loading}>
            {isSignIn ? "Create account" : "Sign in"}
          </button>
        </div>
        {googleLoading && loading && (
          <div className="sw-auth-processing-overlay">
            <div className="sw-auth-processing-content">
              <div className="sw-auth-processing-logo">
                <span>S</span>
              </div>

              <div className="sw-auth-processing-loader">
                <span />
              </div>

              <strong>Signing you in</strong>

              <p>Connecting securely with Google...</p>

              <small>Please keep this window open</small>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
