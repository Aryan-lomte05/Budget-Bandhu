"use client";

import { HelpCircle } from "lucide-react";

export function ContextualHelp({ text }: { text: string }) {
    return (
        <div className="inline-flex items-center gap-1 text-xs text-gray-500 cursor-help">
            <HelpCircle className="w-3 h-3" />
            <span>{text}</span>
        </div>
    );
}
