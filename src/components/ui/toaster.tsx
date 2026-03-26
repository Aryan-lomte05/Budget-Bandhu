"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
    return (
        <Sonner
            position="top-right"
            toastOptions={{
                style: {
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '16px',
                },
            }}
        />
    );
}
