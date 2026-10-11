"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type ToastTone = "success" | "error" | "info";

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Auto-dismiss delay in ms. Errors default to 8s, others to 5s. 0 disables. */
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastItem extends Required<Pick<ToastOptions, "title" | "tone">> {
  id: number;
  description?: string;
  duration: number;
  action?: ToastOptions["action"];
  leaving?: boolean;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<number, number>());

  const remove = useCallback((id: number) => {
    const t = timers.current.get(id);
    if (t) window.clearTimeout(t);
    timers.current.delete(id);
    setItems((list) => list.filter((i) => i.id !== id));
  }, []);

  const dismiss = useCallback(
    (id: number) => {
      setItems((list) => list.map((i) => (i.id === id ? { ...i, leaving: true } : i)));
      window.setTimeout(() => remove(id), 180);
    },
    [remove],
  );

  const schedule = useCallback(
    (id: number, duration: number) => {
      if (duration <= 0) return;
      const existing = timers.current.get(id);
      if (existing) window.clearTimeout(existing);
      timers.current.set(id, window.setTimeout(() => dismiss(id), duration));
    },
    [dismiss],
  );

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId++;
      const tone = options.tone ?? "info";
      const duration = options.duration ?? (tone === "error" ? 8000 : 5000);
      setItems((list) => [...list.slice(-3), { id, title: options.title, description: options.description, tone, duration, action: options.action }]);
      schedule(id, duration);
      return id;
    },
    [schedule],
  );

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((t) => window.clearTimeout(t));
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[120] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
        aria-live="polite"
        aria-relevant="additions"
      >
        {items.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} onPause={() => timers.current.get(item.id) && window.clearTimeout(timers.current.get(item.id))} onResume={() => schedule(item.id, Math.min(item.duration, 3000))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ item, onDismiss, onPause, onResume }: { item: ToastItem; onDismiss: () => void; onPause: () => void; onResume: () => void }) {
  const tones: Record<ToastTone, { bar: string; icon: ReactNode }> = {
    success: {
      bar: "bg-teal",
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 text-teal" aria-hidden="true">
          <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.15" />
          <path d="m6 10.5 2.5 2.5L14 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    error: {
      bar: "bg-danger",
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 text-danger" aria-hidden="true">
          <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.15" />
          <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    info: {
      bar: "bg-amber",
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 text-amber-700" aria-hidden="true">
          <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.15" />
          <path d="M10 9v5M10 6.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  };
  const t = tones[item.tone];

  return (
    <div
      role={item.tone === "error" ? "alert" : "status"}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocus={onPause}
      onBlur={onResume}
      className={`toast pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-white shadow-modal ${item.leaving ? "toast-leave" : ""}`}
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${t.bar}`} aria-hidden="true" />
      <div className="flex items-start gap-3 py-3.5 pl-4 pr-3">
        <span className="mt-0.5 flex-none">{t.icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-navy">{item.title}</p>
          {item.description ? <p className="mt-0.5 text-sm leading-snug text-ink-muted">{item.description}</p> : null}
          {item.action ? (
            <button
              type="button"
              onClick={() => {
                item.action?.onClick();
                onDismiss();
              }}
              className="mt-2 text-sm font-bold text-teal-700 underline underline-offset-2 hover:text-teal"
            >
              {item.action.label}
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="-mr-1 -mt-1 rounded-lg p-1.5 text-ink-subtle transition hover:bg-canvas hover:text-navy"
          aria-label="Dismiss notification"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
