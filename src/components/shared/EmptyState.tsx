"use client";

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: string;
}

export function EmptyState({ title, description, icon = "📭" }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-6xl mb-4">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 max-w-sm">{description}</p>
        </div>
    );
}
