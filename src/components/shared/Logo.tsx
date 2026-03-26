"use client";

export function Logo() {
    return (
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-mint-500 to-skyBlue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BB</span>
            </div>
            <span className="font-bold text-gray-900">Budget Bandhu</span>
        </div>
    );
}
