"use client";

import { Slider } from "@/components/ui/slider";

interface BudgetSliderProps {
    value: number;
    onChange: (value: number) => void;
    label: string;
}

export function BudgetSlider({ value, onChange, label }: BudgetSliderProps) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-sm font-semibold">₹{value.toLocaleString('en-IN')}</span>
            </div>
            <Slider value={value} onChange={onChange} min={0} max={20000} step={500} />
        </div>
    );
}
