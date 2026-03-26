"use client";

import { colors } from "@/lib/constants/colors";

interface CategoryBadgeProps {
    category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
    const categoryColors = colors.categories as Record<string, string>;
    const color = categoryColors[category] || '#6B7280';

    return (
        <span
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
            style={{
                backgroundColor: `${color}20`,
                color: color,
            }}
        >
            {category}
        </span>
    );
}
