import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import "./Toast.css";

const ToastContext = createContext(null);

const DEFAULT_DURATION = 3200;

let nextToastId = 1;

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const dismissToast = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((message, type = "success", duration = DEFAULT_DURATION) => {
    if (!message) {
      return;
    }

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setToast({
      id: nextToastId += 1,
      message,
      type,
    });

    timerRef.current = window.setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, duration);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const value = useMemo(() => ({ toast, showToast, dismissToast }), [toast, showToast, dismissToast]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastViewport() {
  const { toast, dismissToast } = useToast();

  if (!toast) {
    return null;
  }

  return (
    <div className="toast-viewport" aria-live={toast.type === "error" ? "assertive" : "polite"} aria-atomic="true">
      <div className={`toast-card toast-card--${toast.type || "info"}`} role="status">
        <div className="toast-card__message">{toast.message}</div>
        <button type="button" className="toast-card__close" onClick={dismissToast} aria-label="Dismiss notification">
          ×
        </button>
      </div>
    </div>
  );
}
