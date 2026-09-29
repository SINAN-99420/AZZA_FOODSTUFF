import { useEffect, useRef, useState } from "react";
import { CircleCheck, CircleX, TriangleAlert, Info, X } from "lucide-react";
import "./Toast.css";

/* =========================
   TOAST EMITTER
========================= */

const listeners = new Set();
let nextId = 1;

const DURATIONS = {
  success: 3000,
  info: 3500,
  warning: 4000,
  error: 4500,
};

const emit = (type, text) => {
  if (!text) return;

  const item = { id: nextId++, type, text: String(text) };

  listeners.forEach((listener) => listener(item));
};

export const toast = {
  success: (text) => emit("success", text),
  error: (text) => emit("error", text),
  warning: (text) => emit("warning", text),
  info: (text) => emit("info", text),
};

const ICONS = {
  success: CircleCheck,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
};

const MAX_VISIBLE = 4;

/* =========================
   SINGLE TOAST
========================= */

function ToastItem({ item, onDismiss }) {
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);
  const remainingRef = useRef(DURATIONS[item.type]);
  const startRef = useRef(0);

  const close = () => setLeaving(true);

  const startTimer = () => {
    startRef.current = Date.now();
    timerRef.current = setTimeout(close, remainingRef.current);
  };

  const pauseTimer = () => {
    clearTimeout(timerRef.current);
    remainingRef.current -= Date.now() - startRef.current;
  };

  useEffect(() => {
    startTimer();
    return () => clearTimeout(timerRef.current);
  }, []);

  const Icon = ICONS[item.type];

  return (
    <div
      className={`azza-toast azza-toast-${item.type}${leaving ? " azza-toast-leaving" : ""}`}
      role={item.type === "error" ? "alert" : "status"}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      onAnimationEnd={(e) =>
        leaving && e.target === e.currentTarget && onDismiss(item.id)
      }
    >
      <Icon className="azza-toast-icon" size={20} strokeWidth={2} />

      <p className="azza-toast-text">{item.text}</p>

      <button
        type="button"
        className="azza-toast-close"
        aria-label="Dismiss notification"
        onClick={close}
      >
        <X size={16} />
      </button>

      <span
        className="azza-toast-progress"
        style={{ animationDuration: `${DURATIONS[item.type]}ms` }}
      />
    </div>
  );
}

/* =========================
   TOAST CONTAINER
========================= */

export function Toaster() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const listener = (item) =>
      setItems((prev) => [...prev, item].slice(-MAX_VISIBLE));

    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const dismiss = (id) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  return (
    <div className="azza-toast-container" aria-live="polite">
      {items.map((item) => (
        <ToastItem key={item.id} item={item} onDismiss={dismiss} />
      ))}
    </div>
  );
}
