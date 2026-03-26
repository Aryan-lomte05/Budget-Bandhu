"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./button";

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />
            <div className="relative z-50">{children}</div>
        </div>
    );
}

export function DialogContent({
    className,
    children,
    onClose,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) {
    return (
        <div
            className={cn(
                "bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-slide-up",
                className
            )}
            onClick={(e) => e.stopPropagation()}
            {...props}
        >
            {onClose && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={onClose}
                >
                    <X className="w-4 h-4" />
                </Button>
            )}
            {children}
        </div>
    );
}

export function DialogHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex flex-col space-y-1.5 mb-4", className)}
            {...props}
        />
    );
}

export function DialogTitle({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            className={cn("text-lg font-semibold text-gray-900", className)}
            {...props}
        />
    );
}

export function DialogDescription({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn("text-sm text-gray-600", className)}
            {...props}
        />
    );
}
