"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ArrowLeftRight,
    Target,
    MessageCircle,
    User,
} from "lucide-react";

const mobileNav = [
    { name: "Home", href: "/", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { name: "Budget", href: "/budget", icon: Target },
    { name: "Chat", href: "/chat", icon: MessageCircle },
    { name: "Profile", href: "/settings", icon: User },
];

interface MobileNavProps {
    className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
    const pathname = usePathname();

    return (
        <nav
            className={cn(
                "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50",
                className
            )}
        >
            <div className="flex items-center justify-around px-2 py-2">
                {mobileNav.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[4rem]",
                                isActive
                                    ? "bg-mint-50"
                                    : "hover:bg-gray-50"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-5 h-5",
                                    isActive ? "text-mint-600" : "text-gray-600"
                                )}
                            />
                            <span
                                className={cn(
                                    "text-xs font-medium",
                                    isActive ? "text-mint-700" : "text-gray-600"
                                )}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
