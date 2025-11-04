import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface InputWithIconProps extends React.ComponentProps<"input"> {
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    inputBg?: string;
    useAlternativeAutofill?: boolean;
    showPasswordToggle?: boolean; // Cho phép tắt toggle nếu muốn
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
    (
        {
            className,
            type,
            icon,
            iconPosition = "left",
            inputBg,
            useAlternativeAutofill = false,
            showPasswordToggle = true,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = React.useState(false);

        // Xác định type thực tế của input
        const inputType = type === "password" && showPassword ? "text" : type;

        // Kiểm tra có phải password field và có hiển thị toggle không
        const hasPasswordToggle = type === "password" && showPasswordToggle;

        // Nếu có password toggle, icon phải ở bên trái (hoặc không có)
        const effectiveIconPosition = hasPasswordToggle ? "left" : iconPosition;

        return (
            <div className="relative">
                {icon && effectiveIconPosition === "left" && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                        {icon}
                    </span>
                )}

                <input
                    type={inputType}
                    ref={ref}
                    data-slot="input"
                    style={
                        {
                            "--input-bg": inputBg ?? "var(--input)",
                            "--autofill-text-color": "var(--foreground)",
                            "--autofill-bg-color": inputBg ?? "var(--input)",
                        } as React.CSSProperties
                    }
                    className={cn(
                        useAlternativeAutofill ? "custom-autofill-alt" : "custom-autofill",
                        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border",
                        "bg-[color:var(--input)]",
                        "py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        // Xử lý padding dựa trên icon và password toggle
                        hasPasswordToggle && icon
                            ? "pl-10 pr-10" // Có cả icon và toggle
                            : hasPasswordToggle
                            ? "pl-3 pr-10" // Chỉ có toggle
                            : icon && effectiveIconPosition === "left"
                            ? "pl-10 pr-3"
                            : icon && effectiveIconPosition === "right"
                            ? "pl-3 pr-10"
                            : "px-3",
                        className
                    )}
                    {...props}
                />

                {/* Password toggle button */}
                {hasPasswordToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}

                {icon && effectiveIconPosition === "right" && !hasPasswordToggle && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                        {icon}
                    </span>
                )}
            </div>
        );
    }
);

InputWithIcon.displayName = "InputWithIcon";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    );
}

export { Input, InputWithIcon };
