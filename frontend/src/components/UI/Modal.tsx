"use client";

import React from "react";
import ReactDOM from "react-dom";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  hideCloseButton?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  footer?: React.ReactNode;
  preventClose?: boolean; // if true, disallow backdrop / esc close
  className?: string; // extra classes for panel
}

// Simple className merge
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const sizeMap: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  hideCloseButton = false,
  initialFocusRef,
  footer,
  preventClose = false,
  className,
}) => {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const lastFocused = React.useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const portalEl = React.useRef<HTMLElement | null>(null);

  // Create portal element once client side
  React.useEffect(() => {
    setMounted(true);
    if (!portalEl.current) {
      const el = document.createElement("div");
      el.setAttribute("data-ui-modal-portal", "");
      document.body.appendChild(el);
      portalEl.current = el;
    }
    return () => {
      if (portalEl.current) {
        portalEl.current.remove();
        portalEl.current = null;
      }
    };
  }, []);

  // Lock scroll when open
  React.useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Focus handling
  React.useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement as HTMLElement | null;
      const target =
        initialFocusRef?.current ||
        panelRef.current?.querySelector<HTMLElement>("[data-autofocus]") ||
        panelRef.current;
      setTimeout(() => target?.focus(), 0);
    } else if (lastFocused.current) {
      lastFocused.current.focus();
    }
  }, [open, initialFocusRef]);

  // Close on escape
  React.useEffect(() => {
    if (!open || preventClose) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      if (e.key === "Tab") {
        // rudimentary focus trap
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;
        const list = Array.from(focusable).filter((el) => !el.getAttribute("aria-hidden"));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [open, preventClose, onClose]);

  if (!mounted || !portalEl.current || !open) return null;

  const panel = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "ui-modal-title" : undefined}
      aria-describedby={description ? "ui-modal-desc" : undefined}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => {
          if (!preventClose) onClose();
        }}
        aria-hidden
      />
      <div
        ref={panelRef}
        className={cn(
          "animate-in fade-in zoom-in-95 relative mx-auto w-full origin-top rounded-xl border border-black/5 bg-white shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-[#0E1046]",
          sizeMap[size],
          className,
        )}
        tabIndex={-1}
      >
        <div className="flex items-start gap-4 border-b px-5 py-4">
          <div className="flex-1">
            {title && (
              <h2 id="ui-modal-title" className="text-base font-semibold text-[#0E1046]">
                {title}
              </h2>
            )}
            {description && (
              <div id="ui-modal-desc" className="mt-1 text-sm text-gray-600">
                {description}
              </div>
            )}
          </div>
          {!hideCloseButton && (
            <button
              type="button"
              onClick={() => !preventClose && onClose()}
              className="rounded p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E1046]"
              aria-label="Cerrar"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="max-h-[calc(80vh-160px)] overflow-auto px-5 py-4 text-sm text-[#0E1046]">
          {children}
        </div>
        {(footer || !hideCloseButton) && (
          <div className="flex items-center justify-end gap-3 rounded-b-xl border-t bg-gray-50 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(panel, portalEl.current);
};

Modal.displayName = "Modal";

export default Modal;
