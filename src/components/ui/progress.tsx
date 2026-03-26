"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
}

export function Progress({ value, max = 100, className, ...props }: ProgressProps) {
    const percentage = Math.min((value / max) * 100, 100);
    const isOverBudget = percentage > 100;

    return (
        <div
            className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}
            {...props}
        >
            <div
                className={cn(
                    "h-full transition-all duration-500 ease-out rounded-full",
                    isOverBudget ? "bg-coral-500" : percentage > 80 ? "bg-coral-500" : "bg-mint-500"
                )}
                style={{ width: `${Math.min(percentage, 100)}%` }}
            />
        </div>
    );
}
