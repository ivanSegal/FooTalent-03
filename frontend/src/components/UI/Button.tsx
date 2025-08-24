import React from "react";

export type ButtonSize = "sm" | "md" | "lg" | "small" | "medium" | "large";

// New API
export type Severity = "primary" | "secondary" | "tertiary" | "approved" | "neutral" | "error";
export type Appearance = "solid" | "outlined";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  severity?: Severity; // e.g., primary | secondary | approved | neutral | error
  appearance?: Appearance; // solid | outlined

  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// simple className merge
function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

const baseStyles =
  "inline-flex items-center justify-center select-none transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed";

const normalizeSize = (size: ButtonSize): "sm" | "md" | "lg" => {
  if (size === "small") return "sm";
  if (size === "medium") return "md";
  if (size === "large") return "lg";
  return size;
};

const sizeStyles: Record<"sm" | "md" | "lg", string> = {
  sm: "h-[40px] px-4 text-[14px] font-semibold rounded-[2px]",
  // Figma spec: 159x52 with 13px 37px padding and 15px radius
  md: "py-[8px] min-w-[159px] px-[37px] text-[18px] font-semibold rounded-[3px]",
  lg: "h-[60px] px-8 text-[20px] font-semibold rounded-[4px]",
};

const iconSpacing: Record<"sm" | "md" | "lg", string> = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-3.5",
};

// Map appearance + severity to classes (static strings for Tailwind)
function getStyles(appearance: Appearance, severity: Severity): { button: string; ring: string } {
  if (appearance === "solid") {
    switch (severity) {
      case "primary":
        return {
          button:
            "bg-[#0E1046] text-white hover:bg-[#080A2F] disabled:bg-[#0E1046]/60 disabled:text-white/70",
          ring: "focus-visible:ring-[#0E1046]",
        };
      case "secondary":
        return {
          button:
            "bg-[#2F3167] text-white hover:bg-[#222457] disabled:bg-[#2F3167]/60 disabled:text-white/70",
          ring: "focus-visible:ring-[#2F3167]",
        };
      case "tertiary":
        return {
          button:
            "bg-[#0065FF] text-white hover:brightness-90 disabled:bg-[var(--color-tertiary-500)]/60 disabled:text-white/70",
          ring: "focus-visible:ring-[var(--color-tertiary-500)]",
        };
      case "approved":
        return {
          button:
            "bg-[#68AC34] text-white hover:bg-[#548A2B] disabled:bg-[#68AC34]/60 disabled:text-white/70",
          ring: "focus-visible:ring-[#68AC34]",
        };
      case "neutral":
        return {
          button:
            "bg-[#E3E366] text-[#0E1046] hover:bg-[#D4D469] disabled:bg-[#E3E366]/60 disabled:text-[#0E1046]/70",
          ring: "focus-visible:ring-[#0E1046]",
        };
      case "error":
        return {
          button:
            "bg-[#D82D2D] text-white hover:bg-[#B92626] disabled:bg-[#D82D2D]/60 disabled:text-white/70",
          ring: "focus-visible:ring-[#D82D2D]",
        };
    }
  } else if (appearance === "outlined") {
    switch (severity) {
      case "primary":
        return {
          button:
            "bg-transparent text-[#0E1046] border-2 border-[#0E1046] hover:bg-[#0E1046] hover:text-white disabled:text-[#0E1046]/60 disabled:border-[#0E1046]/40",
          ring: "focus-visible:ring-[#0E1046]",
        };
      case "secondary":
        return {
          button:
            "bg-transparent text-[#2F3167] border-2 border-[#2F3167] hover:bg-[#2F3167] hover:text-white disabled:text-[#2F3167]/60 disabled:border-[#2F3167]/40",
          ring: "focus-visible:ring-[#2F3167]",
        };
      case "tertiary":
        return {
          button:
            "bg-transparent text-[var(--color-tertiary-500)] border-2 border-[var(--color-tertiary-500)] hover:bg-[var(--color-tertiary-500)] hover:text-white disabled:text-[var(--color-tertiary-500)]/60 disabled:border-[var(--color-tertiary-500)]/40",
          ring: "focus-visible:ring-[var(--color-tertiary-500)]",
        };
      case "approved":
        return {
          button:
            "bg-transparent text-[#68AC34] border-2 border-[#68AC34] hover:bg-[#68AC34] hover:text-white disabled:text-[#68AC34]/60 disabled:border-[#68AC34]/40",
          ring: "focus-visible:ring-[#68AC34]",
        };
      case "neutral":
        return {
          button:
            "bg-transparent text-[#0E1046] border-2 border-[#E3E366] hover:bg-[#E3E366] hover:text-[#0E1046] disabled:text-[#0E1046]/60 disabled:border-[#E3E366]/40",
          ring: "focus-visible:ring-[#0E1046]",
        };
      case "error":
        return {
          button:
            "bg-transparent text-[#D82D2D] border-2 border-[#D82D2D] hover:bg-[#D82D2D] hover:text-white disabled:text-[#D82D2D]/60 disabled:border-[#D82D2D]/40",
          ring: "focus-visible:ring-[#D82D2D]",
        };
    }
  }
  return { button: "", ring: "" };
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      severity: severityProp,
      appearance: appearanceProp,
      size = "md",
      fullWidth = false,
      loading = false,
      className,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const severity: Severity = severityProp ?? "primary";
    const appearance: Appearance = appearanceProp ?? "solid";

    const resolvedSize = normalizeSize(size);
    const { button: styleClasses, ring } = getStyles(appearance, severity);
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          sizeStyles[resolvedSize],
          iconSpacing[resolvedSize],
          styleClasses,
          ring,
          fullWidth && "w-full",
          // Typography per Figma
          'font-["DM Sans"]',
          className,
        )}
        aria-disabled={isDisabled}
        aria-busy={loading || undefined}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 -ml-1 h-5 w-5 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {!loading && leftIcon ? <span className="inline-flex">{leftIcon}</span> : null}
        <span className={cn("whitespace-nowrap", loading && "opacity-80")}>{children}</span>
        {!loading && rightIcon ? <span className="inline-flex">{rightIcon}</span> : null}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
