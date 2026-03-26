'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Phone, Sparkles, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
}

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    // Password strength calculator
    const calculatePasswordStrength = (password: string): PasswordStrength => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[@$!%*?&#]/.test(password)) score++;

        const strengths: PasswordStrength[] = [
            { score: 0, label: 'Too weak', color: 'bg-red-500' },
            { score: 1, label: 'Weak', color: 'bg-orange-500' },
            { score: 2, label: 'Fair', color: 'bg-yellow-500' },
            { score: 3, label: 'Good', color: 'bg-lime-500' },
            { score: 4, label: 'Strong', color: 'bg-emerald-500' },
        ];

        return strengths[score];
    };

    const passwordStrength = calculatePasswordStrength(formData.password);

    const passwordRequirements = [
        { met: formData.password.length >= 8, text: 'At least 8 characters' },
        { met: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
        { met: /[a-z]/.test(formData.password), text: 'One lowercase letter' },
        { met: /\d/.test(formData.password), text: 'One number' },
        { met: /[@$!%*?&#]/.test(formData.password), text: 'One special character' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        if (passwordStrength.score < 3) {
            toast.error('Please use a stronger password');
            return;
        }

        // Validate and format mobile number
        let mobile = formData.phone.replace(/\D/g, '');
        if (mobile.length === 10) {
            mobile = '91' + mobile;
        }

        if (mobile.length !== 12 || !mobile.startsWith('91')) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8000'}/api/v1/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    mobile: mobile,
                    password: formData.password,
                    income: 50000 // Default income
                })
            });

            if (res.ok) {
                toast.success('Account created! Please login.');
                router.push('/auth/login');
            } else {
                const error = await res.text();
                toast.error(error || 'Registration failed');
            }
        } catch (err) {
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
        >
            {/* Logo & Title */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-blue-500 mb-4 shadow-2xl"
                >
                    <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    Join Budget Bandhu
                </h1>
                <p className="text-gray-600">Start your financial transformation today</p>
            </div>

            {/* Glassmorphic Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/50 p-8"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                                placeholder="Aryan Lomte"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                                placeholder="+91 98765 43210"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Password Strength Bar */}
                        <AnimatePresence>
                            {formData.password && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 space-y-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                                                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600">
                                            {passwordStrength.label}
                                        </span>
                                    </div>

                                    {/* Password Requirements */}
                                    <div className="space-y-1">
                                        {passwordRequirements.map((req, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="flex items-center gap-2 text-xs"
                                            >
                                                {req.met ? (
                                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                ) : (
                                                    <X className="w-3.5 h-3.5 text-gray-300" />
                                                )}
                                                <span className={req.met ? 'text-emerald-600' : 'text-gray-500'}>
                                                    {req.text}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({ ...formData, confirmPassword: e.target.value })
                                }
                                className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                        )}
                    </div>

                    {/* Terms & Conditions */}
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            required
                            className="w-4 h-4 mt-0.5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                        />
                        <label className="ml-2 text-sm text-gray-600">
                            I agree to the{' '}
                            <Link href="/terms" className="text-emerald-600 hover:text-emerald-700">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
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
                                Creating account...
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </motion.button>
                </form>

                {/* Sign In Link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                        href="/auth/login"
                        className="text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
}
