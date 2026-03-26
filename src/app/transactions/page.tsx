"use client";

import { useState, useRef } from "react";
import { TransactionList } from "@/components/transactions/TransactionList";
import { ReceiptScanner } from "@/components/transactions/ReceiptScanner";
import { VoiceInput } from "@/components/transactions/VoiceInput";
import { CSVUpload } from "@/components/transactions/CSVUpload";
import { AddTransactionModal } from "@/components/transactions/AddTransactionModal";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { useUserStore } from "@/lib/store/useUserStore";
import { useTransactions } from "@/lib/hooks/useMLApi";
import { mockData } from "@/lib/api/mock-data";
import { Search, Plus, Mic, Download, Camera, Upload, AlertTriangle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { GradientBorderPulse } from "@/components/animations/GradientBorderPulse";
import { ScanShimmer } from "@/components/animations/ScanShimmer";
import { MicPulse } from "@/components/animations/MicPulse";

// Demo user ID - replace with actual user from auth
const DEMO_USER_ID = "696a022c3c758e29b2ca8d50";

export default function TransactionsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isHoveringScan, setIsHoveringScan] = useState(false);
    const [isHoveringVoice, setIsHoveringVoice] = useState(false);
    const [showCSVUpload, setShowCSVUpload] = useState(false);
    const [showReceiptScanner, setShowReceiptScanner] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [scannedData, setScannedData] = useState<{
        amount?: number;
        description?: string;
        date?: string;
    } | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<{ count: number; anomalies: number } | null>(null);

    // Get user from store or use demo
    const { userId } = useUserStore();
    const activeUserId = userId || DEMO_USER_ID;

    // Fetch real transactions from API
    const {
        transactions: apiTransactions,
        stats,
        loading,
        error,
        refetch,
    } = useTransactions(activeUserId);

    // Use API data if available. Only use mock data if using DEMO ID and no API data found.
    const shouldUseRealData = activeUserId !== DEMO_USER_ID || apiTransactions.length > 0;

    const transactions = shouldUseRealData
        ? apiTransactions.map(t => ({
            id: t.id,
            date: t.date,
            merchant: t.description,
            amount: t.amount,
            category: t.category,
            type: t.type,
            balance: 0,
            notes: t.notes || '',
            isAnomaly: t.is_anomaly,
            anomalySeverity: t.anomaly_severity,
            categoryConfidence: t.category_confidence
        }))
        : mockData.transactions;

    const filteredTransactions = transactions.filter(txn =>
        txn.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle CSV upload success
    const handleUploadComplete = (result: any) => {
        setUploadSuccess({
            count: result.inserted_count,
            anomalies: result.anomaly_stats?.anomaly_count || 0
        });
        refetch(); // Refresh transaction list
        setTimeout(() => setUploadSuccess(null), 5000);
    };

    // Handle Receipt Scan Success
    const handleScanComplete = (data: any) => {
        setScannedData(data);
        setShowReceiptScanner(false);
        setShowAddModal(true);
    };

    // Scroll animations
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start end", "end start"]
    });

    const textScale = useSpring(
        useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.5, 0.75, 0.95, 1.0]),
        { stiffness: 100, damping: 30 }
    );
    const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5]);

    const cardScale = useSpring(
        useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 0.98, 1.0]),
        { stiffness: 100, damping: 30 }
    );

    return (
        <div className="space-y-0 relative">
            {/* Language Selector */}
            <div className="fixed top-24 right-8 z-40">
                <LanguageSelector />
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showReceiptScanner && (
                    <ReceiptScanner
                        onScanComplete={handleScanComplete}
                        onClose={() => setShowReceiptScanner(false)}
                    />
                )}
                {showAddModal && (
                    <AddTransactionModal
                        isOpen={showAddModal}
                        onClose={() => {
                            setShowAddModal(false);
                            setScannedData(null);
                            refetch();
                        }}
                        initialData={scannedData}
                    />
                )}
            </AnimatePresence>

            {/* Success Toast */}
            <AnimatePresence>
                {uploadSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg"
                    >
                        <p className="font-semibold">✅ {uploadSuccess.count} transactions processed!</p>
                        {uploadSuccess.anomalies > 0 && (
                            <p className="text-sm opacity-90">🔍 {uploadSuccess.anomalies} anomalies detected</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SECTION 1: Hero - Cream Background */}
            <section ref={heroRef} className="mm-section-cream mm-section-spacing relative perspective-container overflow-hidden">
                <div className="mm-container px-8 py-16 w-full max-w-7xl mx-auto">
                    {/* Massive Headline */}
                    <motion.div
                        style={{
                            scale: textScale,
                            opacity: textOpacity
                        }}
                        className="mb-16"
                    >
                        <h1 className="mm-section-heading text-center">
                            YOUR MONEY
                            <br />
                            EVERY RUPEE TRACKED
                        </h1>
                        <p className="text-center text-xl text-gray-700 mt-6 max-w-2xl mx-auto">
                            Track and manage your recent spending with AI-powered insights
                        </p>

                        {/* Stats from API */}
                        {stats && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center gap-8 mt-8"
                            >
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-mm-purple">{stats.total_transactions}</p>
                                    <p className="text-sm text-gray-500">Transactions</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-red-500">{stats.total_anomalies}</p>
                                    <p className="text-sm text-gray-500">Anomalies</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-green-500">{Object.keys(stats.category_breakdown || {}).length}</p>
                                    <p className="text-sm text-gray-500">Categories</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Quick Actions Grid - Now 3 columns with CSV Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
                        {/* CSV Upload Card - NEW */}
                        <motion.div
                            style={{ scale: cardScale }}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -6 }}
                            onClick={() => setShowCSVUpload(!showCSVUpload)}
                            className="mm-card-hover relative h-[200px] rounded-2xl p-6 cursor-pointer overflow-hidden
                                       bg-gradient-to-br from-emerald-400 to-teal-500 text-white
                                       shadow-lg hover:shadow-2xl transition-shadow duration-500 ease-out"
                        >
                            <motion.div
                                className="absolute bottom-4 right-4 text-7xl opacity-20 pointer-events-none"
                                animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                📊
                            </motion.div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <Upload className="w-[1.875rem] h-[1.875rem]" />
                                        <h3 className="text-3xl font-semibold leading-tight">Upload CSV</h3>
                                    </div>
                                    <p className="text-lg opacity-90 font-medium">Bulk import with ML processing</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm opacity-75">
                                    <span className="px-2 py-1 bg-white/20 rounded-full">Categorizer</span>
                                    <span className="px-2 py-1 bg-white/20 rounded-full">Anomaly Detection</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Scan Receipt Card */}
                        <motion.div
                            style={{ scale: cardScale }}
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -6 }}
                            onHoverStart={() => setIsHoveringScan(true)}
                            onHoverEnd={() => setIsHoveringScan(false)}
                            onClick={() => setShowReceiptScanner(true)}
                            className="mm-card-hover relative h-[200px] rounded-2xl p-6 cursor-pointer overflow-hidden
                                       bg-gradient-to-br from-orange-400 to-orange-500 text-white
                                       shadow-lg hover:shadow-2xl transition-shadow duration-500 ease-out"
                        >
                            <GradientBorderPulse isHovered={isHoveringScan} color="orange" />
                            <AnimatePresence>
                                {isHoveringScan && <ScanShimmer isActive={isHoveringScan} />}
                            </AnimatePresence>
                            <motion.div
                                className="absolute bottom-4 right-4 text-7xl opacity-20 pointer-events-none"
                                animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                🧾
                            </motion.div>
                            <div className="mm-card-main-content relative z-10 h-full flex items-stretch gap-2">
                                <div className="flex flex-col gap-3 flex-1">
                                    <motion.div
                                        className="flex items-center gap-2"
                                        animate={isHoveringScan ? { x: 3 } : { x: 0 }}
                                    >
                                        <Camera className="w-[1.875rem] h-[1.875rem]" />
                                        <h3 className="text-3xl font-semibold leading-tight">Scan Receipt</h3>
                                    </motion.div>
                                    <p className="text-lg opacity-90 leading-relaxed font-medium">Auto-detect amount & category</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Voice Log Card */}
                        <motion.div
                            style={{ scale: cardScale }}
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -6 }}
                            onHoverStart={() => setIsHoveringVoice(true)}
                            onHoverEnd={() => setIsHoveringVoice(false)}
                            className="mm-card-hover relative h-[200px] rounded-2xl p-6 cursor-pointer overflow-hidden
                                       bg-gradient-to-br from-purple-600 to-purple-700 text-white
                                       shadow-lg hover:shadow-2xl transition-shadow duration-500 ease-out"
                        >
                            <GradientBorderPulse isHovered={isHoveringVoice} color="purple" />
                            <div className="mm-card-main-content relative z-10 h-full flex items-stretch gap-2">
                                <div className="flex flex-col gap-3 flex-1">
                                    <div className="flex items-center gap-2 relative">
                                        <div className="absolute -left-2 -top-2 w-[2.375rem] h-[2.375rem]">
                                            <MicPulse />
                                        </div>
                                        <motion.div
                                            className="relative z-10 flex items-center gap-2"
                                            animate={isHoveringVoice ? { y: -2 } : { y: 0 }}
                                        >
                                            <Mic className="w-[1.875rem] h-[1.875rem]" />
                                            <h3 className="text-3xl font-semibold leading-tight">Voice Log</h3>
                                        </motion.div>
                                    </div>
                                    <p className="text-lg opacity-90 leading-relaxed font-medium">"Spent ₹200 on Coffee"</p>
                                </div>
                                <VoiceInput />
                            </div>
                        </motion.div>
                    </div>

                    {/* CSV Upload Panel - Expandable */}
                    <AnimatePresence>
                        {showCSVUpload && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-8 max-w-4xl mx-auto overflow-hidden"
                            >
                                <CSVUpload
                                    userId={activeUserId}
                                    onUploadComplete={handleUploadComplete}
                                    onError={(err) => console.error('Upload error:', err)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* SECTION 2: Transactions List - Mint Background */}
            <section className="mm-section-mint mm-section-spacing">
                <div className="mm-container px-8 py-16 w-full max-w-7xl mx-auto">
                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                        <Input
                            className="pl-16 h-16 rounded-2xl bg-white border-gray-200 text-lg shadow-sm"
                            placeholder="Search by merchant or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Transaction List Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="mm-card card-3d"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-bold text-mm-black">Recent Transactions</h3>
                                    {loading && <Loader2 className="w-5 h-5 animate-spin text-mm-purple" />}
                                    {apiTransactions.length > 0 && (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                            LIVE DATA
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 mt-1">{filteredTransactions.length} transactions found</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => refetch()}
                                    className="mm-btn mm-btn-secondary flex items-center gap-2"
                                >
                                    <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                                <button className="mm-btn mm-btn-secondary flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                <p className="text-red-600">{error}</p>
                                <button onClick={() => refetch()} className="ml-auto text-sm text-red-600 underline">Retry</button>
                            </div>
                        )}

                        {/* Anomaly Highlight */}
                        {apiTransactions.filter(t => t.is_anomaly).length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-amber-800">
                                            {apiTransactions.filter(t => t.is_anomaly).length} Suspicious Transaction(s) Detected
                                        </p>
                                        <p className="text-sm text-amber-600">ML flagged unusual spending patterns</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <TransactionList transactions={filteredTransactions as any} />
                    </motion.div>
                </div>
            </section>

            {/* SECTION 3: Add Transaction CTA - Orange Background */}
            <section className="mm-section-orange mm-section-spacing">
                <div className="mm-container px-8 py-16 w-full max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="text-5xl md:text-6xl font-black text-mm-black mb-6 leading-tight">
                            Add Your
                            <br />
                            Transactions
                        </h2>
                        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                            Keep your financial records up to date with quick manual entry
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="mm-btn mm-btn-primary text-lg px-12 py-6"
                        >
                            <Plus className="w-6 h-6" />
                            Add Transaction
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
