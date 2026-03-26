"use client";

interface ProgressRingProps {
    progress: number;
    color: string;
}

export function ProgressRing({ progress, color }: ProgressRingProps) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        fill="none"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke={color}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    );
}
