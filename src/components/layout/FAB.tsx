"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FAB() {
    return (
        <Button
            size="icon"
            className="fixed bottom-24 right-6 lg:bottom-6 w-14 h-14 rounded-full bg-mint-500 hover:bg-mint-600 shadow-lg z-40"
        >
            <Plus className="w-6 h-6" />
        </Button>
    );
}
