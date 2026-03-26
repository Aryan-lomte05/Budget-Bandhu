'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        const newOtp = [...otp];
        pastedData.forEach((char, idx) => {
            if (/^\d$/.test(char) && idx < 6) {
                newOtp[idx] = char;
            }
        });
        setOtp(newOtp);
        inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            toast.error('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock validation (in real app, verify with backend)
        if (otpCode === '123456') {
            toast.success('Email verified successfully! 🎉');
            router.push('/');
        } else {
            toast.error('Invalid OTP. Try again.');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
        setIsLoading(false);
    };

    const handleResend = async () => {
        setResendTimer(60);
        toast.success('OTP resent to your email');
        // In real app, call API to resend OTP
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
        >
            {/* Logo */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-blue-500 mb-4 shadow-2xl"
                >
                    <Mail className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    Verify Your Email
                </h1>
                <p className="text-gray-600">
                    We sent a code to <span className="font-semibold">{email}</span>
                </p>
            </div>

            {/* Glassmorphic Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/50 p-8"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* OTP Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                            Enter 6-digit code
                        </label>
                        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                            {otp.map((digit, idx) => (
                                <motion.input
                                    key={idx}
                                    ref={(el) => {
                                        inputRefs.current[idx] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading || otp.join('').length !== 6}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Verifying...
                            </span>
                        ) : (
                            'Verify Email'
                        )}
                    </motion.button>

                    {/* Resend OTP */}
                    <div className="text-center">
                        {resendTimer > 0 ? (
                            <p className="text-sm text-gray-500">
                                Resend code in{' '}
                                <span className="font-semibold text-emerald-600">{resendTimer}s</span>
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
                            >
                                Resend Code
                            </button>
                        )}
                    </div>

                    {/* Back to Login */}
                    <Link
                        href="/auth/login"
                        className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to login
                    </Link>
                </form>
            </motion.div>

            {/* Help Text */}
            <p className="text-center text-xs text-gray-500 mt-6">
                Didn't receive the code? Check your spam folder
            </p>
        </motion.div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
