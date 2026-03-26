"use client";

import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VoiceInput() {
    return (
        <Button variant="outline" size="icon" className="h-[5rem] w-[5rem] min-h-[5rem] min-w-[5rem] rounded-2xl bg-white/20 border-white/40 hover:bg-white/30 backdrop-blur-sm">
            <Mic className="w-7 h-7" />
        </Button>
    );
}
