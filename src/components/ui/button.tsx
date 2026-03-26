import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "destructive";
    size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-500 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-mint-500 text-white hover:bg-mint-600": variant === "default",
                        "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900": variant === "outline",
                        "hover:bg-gray-100 text-gray-900": variant === "ghost",
                        "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
                        "h-10 px-4 py-2": size === "default",
                        "h-9 px-3 text-sm": size === "sm",
                        "h-11 px-8": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
