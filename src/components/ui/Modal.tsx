"use client";

import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
  cloneElement,
} from "react";
import { createPortal } from "react-dom";

/* ---------- Modal context ---------- */
type ModalContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);
export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    // Return a no-op object instead of throwing (for compatibility with BottomSheet)
    return { open: false, setOpen: () => {}, close: () => {}, isOpen: false };
  }
  return ctx;
};

/* ---------- Portal ---------- */
function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

/* ---------- Focus utils ---------- */
const FOCUSABLE_SELECTORS =
  'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

function getFocusable(el?: HTMLElement | null) {
  if (!el) return [];
  return Array.from(el.querySelectorAll(FOCUSABLE_SELECTORS)) as HTMLElement[];
}

/* ---------- Modal root ---------- */
interface ModalProps {
  children?: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disableBodyScroll?: boolean;
}

export default function Modal({
  children,
  isOpen,
  defaultOpen = false,
  onOpenChange,
  disableBodyScroll = true,
}: ModalProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const isControlled = typeof isOpen === "boolean";
  const open = isControlled ? isOpen : openState;

  const setOpen = (v: boolean) => {
    if (!isControlled) setOpenState(v);
    onOpenChange?.(v);
  };
  const close = () => setOpen(false);

  // lock body scroll
  useEffect(() => {
    if (!disableBodyScroll) return;
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open, disableBodyScroll]);

  return (
    <ModalContext.Provider value={{ open, setOpen, close }}>
      {children}
    </ModalContext.Provider>
  );
}

/* ---------- Trigger ---------- */
Modal.Trigger = function Trigger({ children }: { children: ReactNode }) {
  const ctx = useModal();

  if (React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: (e: React.MouseEvent) => void;
    }>;

    const existingOnClick = child.props.onClick;

    return cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        existingOnClick?.(e);
        ctx.setOpen(true);
      },
    });
  }

  return (
    <button type="button" onClick={() => ctx.setOpen(true)}>
      {children}
    </button>
  );
};

/* ---------- Content / Overlay ---------- */
Modal.Content = function Content({
  children,
  className = "",
  width = "max-w-2xl",
  panelClassName = "",
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: {
  children?: ReactNode;
  className?: string;
  width?: string;
  panelClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}) {
  const ctx = useModal();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevActiveRef = useRef<HTMLElement | null>(null);

  // focus management
  useEffect(() => {
    if (!ctx.open) return;
    prevActiveRef.current = document.activeElement as HTMLElement | null;
    setTimeout(() => {
      const focusables = getFocusable(panelRef.current);
      if (focusables.length) focusables[0].focus();
      else panelRef.current?.focus();
    }, 0);
  }, [ctx.open]);

  // ESC + Tab trap
  useEffect(() => {
    if (!ctx.open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && closeOnEsc) ctx.close();

      if (e.key === "Tab") {
        const focusables = getFocusable(panelRef.current);
        if (!focusables.length) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement;
        if (e.shiftKey) {
          if (active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ctx.open, closeOnEsc]);

  // restore focus
  useEffect(() => {
    if (!ctx.open && prevActiveRef.current) {
      prevActiveRef.current.focus();
      prevActiveRef.current = null;
    }
  }, [ctx.open]);

  if (!ctx.open) return null;

  // Check if this is a nested modal (higher z-index)
  const isNested = panelClassName.includes("bg-white") && panelClassName.includes("rounded-lg");
  const overlayZIndex = isNested ? 100 : 50;
  const overlayOpacity = isNested ? "bg-black/70" : "bg-black/45";

  return (
    <Portal>
      <div
        ref={overlayRef}
        aria-hidden={!ctx.open}
        onMouseDown={(e) => {
          if (!closeOnOverlayClick) return;
          if (e.target === overlayRef.current) ctx.close();
        }}
        className="fixed inset-0 flex items-center justify-center px-4 sm:px-6"
        style={{ zIndex: overlayZIndex }}
      >
        <div
          onClick={() => ctx.close()}
          className={`absolute inset-0 ${overlayOpacity} backdrop-blur-sm transition-opacity duration-300`}
        />

        <div
          role="dialog"
          aria-modal="true"
          ref={panelRef}
          tabIndex={-1}
          className={`relative z-10 ${width} mx-auto
            transform transition-all duration-300 ease-out ${panelClassName} ${className}`}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};

/* ---------- Close button ---------- */
Modal.Close = function Close({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const ctx = useModal();

  // Handle children that are React elements
  if (children && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: (e: React.MouseEvent) => void;
    }>;
    const existingOnClick = child.props.onClick;

    return cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        existingOnClick?.(e);
        ctx.close();
      },
    });
  }

  // Default button if no children passed
  return (
    <button
      type="button"
      onClick={ctx.close}
      className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-100 ${className}`}
      aria-label="Close modal"
    >
      ✕
    </button>
  );
};
