/**
 * CSV Upload Component for Transactions
 * Allows users to upload CSV files that get processed by ML pipeline
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, Check, AlertCircle, X, Loader2 } from 'lucide-react';
import { mlApi } from '@/lib/api/ml-api';

interface CSVUploadProps {
    userId: string;
    onUploadComplete?: (result: {
        inserted_count: number;
        categorization_stats: Record<string, number>;
        anomaly_stats: Record<string, number>;
    }) => void;
    onError?: (error: string) => void;
}

type UploadStatus = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

export function CSVUpload({ userId, onUploadComplete, onError }: CSVUploadProps) {
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<{
        inserted_count: number;
        categorization_stats: Record<string, number>;
        anomaly_stats: Record<string, number>;
    } | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setStatus('dragging');
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setStatus('idle');
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    }, []);

    const handleFile = async (file: File) => {
        if (!file.name.endsWith('.csv')) {
            setStatus('error');
            setErrorMessage('Please upload a CSV file');
            onError?.('Please upload a CSV file');
            return;
        }

        setStatus('uploading');
        setProgress(10);
        setErrorMessage(null);

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const uploadResult = await mlApi.transactions.uploadCsv(userId, file);

            clearInterval(progressInterval);
            setProgress(100);
            setResult(uploadResult);
            setStatus('success');
            onUploadComplete?.(uploadResult);

            // Reset after 5 seconds
            setTimeout(() => {
                setStatus('idle');
                setProgress(0);
                setResult(null);
            }, 5000);

        } catch (err) {
            setStatus('error');
            const message = err instanceof Error ? err.message : 'Upload failed';
            setErrorMessage(message);
            onError?.(message);
        }
    };

    const reset = () => {
        setStatus('idle');
        setProgress(0);
        setResult(null);
        setErrorMessage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="relative">
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
            />

            <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => status === 'idle' && fileInputRef.current?.click()}
                className={`
                    relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center
                    transition-all duration-300 cursor-pointer
                    ${status === 'idle' ? 'border-gray-300 hover:border-mm-purple hover:bg-mm-purple/5' : ''}
                    ${status === 'dragging' ? 'border-mm-purple bg-mm-purple/10 scale-[1.02]' : ''}
                    ${status === 'uploading' ? 'border-mm-orange bg-mm-orange/10' : ''}
                    ${status === 'success' ? 'border-mm-green bg-mm-green/10' : ''}
                    ${status === 'error' ? 'border-red-400 bg-red-50' : ''}
                `}
                animate={{
                    scale: status === 'dragging' ? 1.02 : 1,
                }}
            >
                {/* Progress bar */}
                {status === 'uploading' && (
                    <motion.div
                        className="absolute left-0 top-0 h-full bg-mm-orange/20"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                )}

                <div className="relative z-10 flex flex-col items-center gap-4">
                    <AnimatePresence mode="wait">
                        {/* Idle State */}
                        {status === 'idle' && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col items-center gap-3"
                            >
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mm-purple to-mm-lavender flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Upload CSV</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Drag & drop or click to select
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <FileSpreadsheet className="w-4 h-4" />
                                    <span>Required columns: date, amount, description</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Dragging State */}
                        {status === 'dragging' && (
                            <motion.div
                                key="dragging"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center gap-3"
                            >
                                <motion.div
                                    className="w-16 h-16 rounded-full bg-mm-purple flex items-center justify-center"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                >
                                    <Upload className="w-8 h-8 text-white" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-mm-purple">Drop it here!</h3>
                            </motion.div>
                        )}

                        {/* Uploading State */}
                        {status === 'uploading' && (
                            <motion.div
                                key="uploading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-3"
                            >
                                <Loader2 className="w-16 h-16 text-mm-orange animate-spin" />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Processing...</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Running ML pipeline: Categorizer → Anomaly Detection
                                    </p>
                                </div>
                                <div className="text-2xl font-bold text-mm-orange">{progress}%</div>
                            </motion.div>
                        )}

                        {/* Success State */}
                        {status === 'success' && result && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center gap-3"
                            >
                                <motion.div
                                    className="w-16 h-16 rounded-full bg-mm-green flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <Check className="w-8 h-8 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-mm-green">Upload Complete!</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {result.inserted_count} transactions processed
                                    </p>
                                </div>
                                <div className="flex gap-4 text-sm">
                                    <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                                        📊 {result.categorization_stats?.rule_based || 0} rule-based
                                    </span>
                                    <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                                        🔍 {result.anomaly_stats?.anomaly_count || 0} anomalies
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        {/* Error State */}
                        {status === 'error' && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center gap-3"
                            >
                                <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                                    <AlertCircle className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-red-600">Upload Failed</h3>
                                    <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); reset(); }}
                                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Close button for success/error */}
                {(status === 'success' || status === 'error') && (
                    <button
                        onClick={(e) => { e.stopPropagation(); reset(); }}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </motion.div>
        </div>
    );
}
