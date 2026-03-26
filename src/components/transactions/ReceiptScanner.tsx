'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Loader2, Receipt, Check, AlertCircle } from 'lucide-react';
import { mlApi, OCRResult } from '@/lib/api/ml-api';

interface ReceiptScannerProps {
    onScanComplete: (data: {
        amount?: number;
        description?: string;
        date?: string;
    }) => void;
    onClose: () => void;
}

export function ReceiptScanner({ onScanComplete, onClose }: ReceiptScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<OCRResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // Scan
        setIsScanning(true);
        setError(null);

        try {
            const ocrResult = await mlApi.ocr.scanReceipt(file);
            setResult(ocrResult);

            if (ocrResult.amount || ocrResult.description) {
                // Auto-fill successful
            } else {
                setError('Could not extract transaction details. Please enter manually.');
            }
        } catch (err) {
            console.error('[ReceiptScanner] Error:', err);
            setError('Failed to scan receipt. Please try again.');
        } finally {
            setIsScanning(false);
        }
    };

    const handleConfirm = () => {
        if (result) {
            onScanComplete({
                amount: result.amount,
                description: result.description || result.merchant,
                date: result.date,
            });
        }
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <Receipt className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Scan Receipt</h2>
                                <p className="text-white/80 text-sm">Auto-extract transaction details</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Upload Area */}
                    {!preview && (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl mb-4">
                                <Camera className="w-8 h-8 text-emerald-600" />
                            </div>
                            <p className="text-gray-700 font-medium mb-1">
                                Upload Receipt or Bill
                            </p>
                            <p className="text-gray-500 text-sm">
                                Take a photo or select from gallery
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </motion.div>
                    )}

                    {/* Preview */}
                    {preview && (
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Receipt preview"
                                className="w-full h-48 object-cover rounded-2xl"
                            />
                            {isScanning && (
                                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                                        <p className="text-sm">Scanning receipt...</p>
                                    </div>
                                </div>
                            )}
                            {!isScanning && (
                                <button
                                    onClick={() => {
                                        setPreview(null);
                                        setResult(null);
                                        setError(null);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Result */}
                    <AnimatePresence>
                        {result && !isScanning && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-4 space-y-3"
                            >
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <Check className="w-5 h-5" />
                                    <span className="font-medium">Extracted Details</span>
                                </div>

                                {result.amount && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Amount</span>
                                        <span className="text-2xl font-bold text-gray-800">
                                            ₹{result.amount.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                )}

                                {result.merchant && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Merchant</span>
                                        <span className="font-medium text-gray-800">
                                            {result.merchant}
                                        </span>
                                    </div>
                                )}

                                {result.date && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Date</span>
                                        <span className="font-medium text-gray-800">
                                            {result.date}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirm}
                        disabled={!result || isScanning}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Use Details
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}
