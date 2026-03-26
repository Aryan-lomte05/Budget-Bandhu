'use client';

import { usePathname } from 'next/navigation';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { MockToggle } from '@/components/shared/MockToggle';
import { ChatWidget } from '@/components/chat/ChatWidget';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Check if current page is auth-related
    const isAuthPage = pathname?.startsWith('/auth');

    // If auth page, render without navigation
    if (isAuthPage) {
        return <>{children}</>;
    }

    // MetaMask-style layout with top navigation
    return (
        <div className="min-h-screen bg-mm-cream">
            {/* Top Navigation */}
            <TopNavigation />

            {/* Main Content Area */}
            <main className="mm-container py-8">
                {children}
            </main>

            {/* AI Chat Widget */}
            <ChatWidget />

            {/* Developer Mock Toggle */}
            <MockToggle />
        </div>
    );
}
