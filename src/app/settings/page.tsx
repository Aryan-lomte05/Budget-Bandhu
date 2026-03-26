'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Bell,
    Shield,
    Globe,
    Lock,
    CreditCard,
    Download,
    Trash2,
    ChevronRight,
    Settings as SettingsIcon,
    Moon,
    Sun,
    Smartphone,
    Mail,
    MessageSquare,
    Eye,
    Database,
    LogOut,
    Camera,
} from 'lucide-react';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import toast from 'react-hot-toast';

type SettingsTab = 'profile' | 'notifications' | 'privacy' | 'preferences' | 'security' | 'account';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const { profile, notifications, privacy, preferences, security, updateProfile, updateNotifications, updatePrivacy, updatePreferences, updateSecurity } = useSettingsStore();

    const tabs = [
        { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
        { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
        { id: 'privacy' as SettingsTab, label: 'Privacy', icon: Shield },
        { id: 'preferences' as SettingsTab, label: 'Preferences', icon: Globe },
        { id: 'security' as SettingsTab, label: 'Security', icon: Lock },
        { id: 'account' as SettingsTab, label: 'Account', icon: SettingsIcon },
    ];

    const handleSave = () => {
        toast.success('Settings saved successfully!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        Settings
                    </h1>
                    <p className="text-gray-600">Manage your account and preferences</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/50 p-4 space-y-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                                            : 'text-gray-700 hover:bg-white/50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{tab.label}</span>
                                        <ChevronRight className="w-4 h-4 ml-auto" />
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-3"
                    >
                        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/50 p-8">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>

                                    {/* Avatar Upload */}
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                                                {profile.name.charAt(0)}
                                            </div>
                                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100 hover:bg-gray-50 transition-colors">
                                                <Camera className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{profile.name}</h3>
                                            <p className="text-sm text-gray-500">Member since {new Date(profile.joinedDate).toLocaleDateString()}</p>
                                            <button className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                                Change Avatar
                                            </button>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => updateProfile({ name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => updateProfile({ email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => updateProfile({ phone: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                            <textarea
                                                value={profile.bio}
                                                onChange={(e) => updateProfile({ bio: e.target.value })}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50 resize-none"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Preferences</h2>

                                    {/* Channels */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-700">Channels</h3>
                                        <ToggleItem
                                            icon={Smartphone}
                                            label="Push Notifications"
                                            description="Receive notifications on your device"
                                            checked={notifications.pushEnabled}
                                            onChange={(checked) => updateNotifications({ pushEnabled: checked })}
                                        />
                                        <ToggleItem
                                            icon={Mail}
                                            label="Email Notifications"
                                            description="Receive updates via email"
                                            checked={notifications.emailEnabled}
                                            onChange={(checked) => updateNotifications({ emailEnabled: checked })}
                                        />
                                        <ToggleItem
                                            icon={MessageSquare}
                                            label="SMS Notifications"
                                            description="Get text messages for important updates"
                                            checked={notifications.smsEnabled}
                                            onChange={(checked) => updateNotifications({ smsEnabled: checked })}
                                        />
                                    </div>

                                    <div className="border-t border-gray-200 my-6" />

                                    {/* Notification Types */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-700">What to notify me about</h3>
                                        <ToggleItem
                                            icon={Bell}
                                            label="Budget Alerts"
                                            description="Get notified when you exceed budget limits"
                                            checked={notifications.budgetAlerts}
                                            onChange={(checked) => updateNotifications({ budgetAlerts: checked })}
                                        />
                                        <ToggleItem
                                            icon={Bell}
                                            label="Bill Reminders"
                                            description="Reminders for upcoming bill payments"
                                            checked={notifications.billReminders}
                                            onChange={(checked) => updateNotifications({ billReminders: checked })}
                                        />
                                        <ToggleItem
                                            icon={Bell}
                                            label="Goal Milestones"
                                            description="Celebrate when you reach financial goals"
                                            checked={notifications.goalMilestones}
                                            onChange={(checked) => updateNotifications({ goalMilestones: checked })}
                                        />
                                        <ToggleItem
                                            icon={Bell}
                                            label="Weekly Reports"
                                            description="Summary of your spending every week"
                                            checked={notifications.weeklyReports}
                                            onChange={(checked) => updateNotifications({ weeklyReports: checked })}
                                        />
                                        <ToggleItem
                                            icon={Bell}
                                            label="Monthly Reports"
                                            description="Detailed financial reports every month"
                                            checked={notifications.monthlyReports}
                                            onChange={(checked) => updateNotifications({ monthlyReports: checked })}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Privacy Tab */}
                            {activeTab === 'privacy' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Privacy & Data</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                                            <select
                                                value={privacy.profileVisibility}
                                                onChange={(e) => updatePrivacy({ profileVisibility: e.target.value as any })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                                            >
                                                <option value="public">Public - Anyone can see</option>
                                                <option value="friends">Friends - Only friends can see</option>
                                                <option value="private">Private - Only you can see</option>
                                            </select>
                                        </div>

                                        <ToggleItem
                                            icon={Eye}
                                            label="Show Spending Data"
                                            description="Allow others to see your spending patterns"
                                            checked={privacy.showSpending}
                                            onChange={(checked) => updatePrivacy({ showSpending: checked })}
                                        />
                                        <ToggleItem
                                            icon={Eye}
                                            label="Show Financial Goals"
                                            description="Display your goals on your profile"
                                            checked={privacy.showGoals}
                                            onChange={(checked) => updatePrivacy({ showGoals: checked })}
                                        />
                                        <ToggleItem
                                            icon={Database}
                                            label="Data Sharing"
                                            description="Share anonymized data with partners"
                                            checked={privacy.allowDataSharing}
                                            onChange={(checked) => updatePrivacy({ allowDataSharing: checked })}
                                        />
                                        <ToggleItem
                                            icon={Database}
                                            label="Analytics"
                                            description="Help improve the app with usage analytics"
                                            checked={privacy.allowAnalytics}
                                            onChange={(checked) => updatePrivacy({ allowAnalytics: checked })}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">App Preferences</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                                            <select
                                                value={preferences.currency}
                                                onChange={(e) => updatePreferences({ currency: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                                            >
                                                <option value="INR">🇮🇳 INR - Indian Rupee</option>
                                                <option value="USD">🇺🇸 USD - US Dollar</option>
                                                <option value="EUR">🇪🇺 EUR - Euro</option>
                                                <option value="GBP">🇬🇧 GBP - British Pound</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                            <select
                                                value={preferences.language}
                                                onChange={(e) => updatePreferences({ language: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                                            >
                                                <option value="en">English</option>
                                                <option value="hi">हिन्दी (Hindi)</option>
                                                <option value="es">Español (Spanish)</option>
                                                <option value="fr">Français (French)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { value: 'light', icon: Sun, label: 'Light' },
                                                    { value: 'dark', icon: Moon, label: 'Dark' },
                                                    { value: 'auto', icon: Smartphone, label: 'Auto' },
                                                ].map((theme) => {
                                                    const Icon = theme.icon;
                                                    return (
                                                        <button
                                                            key={theme.value}
                                                            onClick={() => updatePreferences({ theme: theme.value as any })}
                                                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${preferences.theme === theme.value
                                                                ? 'border-emerald-500 bg-emerald-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            <Icon className="w-6 h-6" />
                                                            <span className="text-sm font-medium">{theme.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                                            <select
                                                value={preferences.dateFormat}
                                                onChange={(e) => updatePreferences({ dateFormat: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                                            >
                                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h2>

                                    <div className="space-y-4">
                                        <ToggleItem
                                            icon={Lock}
                                            label="Two-Factor Authentication"
                                            description="Add an extra layer of security"
                                            checked={security.twoFactorEnabled}
                                            onChange={(checked) => updateSecurity({ twoFactorEnabled: checked })}
                                        />
                                        <ToggleItem
                                            icon={Smartphone}
                                            label="Biometric Login"
                                            description="Use Face ID or fingerprint"
                                            checked={security.biometricEnabled}
                                            onChange={(checked) => updateSecurity({ biometricEnabled: checked })}
                                        />

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                                            <select
                                                value={security.sessionTimeout}
                                                onChange={(e) => updateSecurity({ sessionTimeout: parseInt(e.target.value) })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                                            >
                                                <option value="15">15 minutes</option>
                                                <option value="30">30 minutes</option>
                                                <option value="60">1 hour</option>
                                                <option value="120">2 hours</option>
                                            </select>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                            <h4 className="font-semibold text-blue-900 mb-2">Active Sessions</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div>
                                                        <p className="font-medium text-blue-800">Windows PC - Chrome</p>
                                                        <p className="text-blue-600">Mumbai, India - Current session</p>
                                                    </div>
                                                    <span className="text-xs text-blue-500">Active now</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors">
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Management</h2>

                                    <div className="space-y-3">
                                        <ActionButton
                                            icon={CreditCard}
                                            label="Linked Bank Accounts"
                                            description="Manage connected banks"
                                            onClick={() => toast('Bank accounts feature coming soon', { icon: '🏦' })}

                                        />
                                        <ActionButton
                                            icon={Download}
                                            label="Export Data"
                                            description="Download your financial data"
                                            onClick={() => toast.success('Exporting data...')}
                                        />
                                        <ActionButton
                                            icon={LogOut}
                                            label="Sign Out"
                                            description="Sign out from all devices"
                                            onClick={() => toast('Signed out successfully', { icon: '👋' })}

                                        />

                                        <div className="border-t border-gray-200 my-6" />

                                        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                            <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
                                            <p className="text-sm text-red-600 mb-4">
                                                Once you delete your account, there is no going back. Please be certain.
                                            </p>
                                            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Save Button */}
                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                                <button className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-white/50 transition-colors">
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSave}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all"
                                >
                                    Save Changes
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// Toggle Item Component
function ToggleItem({
    icon: Icon,
    label,
    description,
    checked,
    onChange,
}: {
    icon: any;
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-gray-200">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="font-medium text-gray-800">{label}</h4>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
            >
                <motion.div
                    animate={{ x: checked ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                />
            </button>
        </div>
    );
}

// Action Button Component
function ActionButton({
    icon: Icon,
    label,
    description,
    onClick,
}: {
    icon: any;
    label: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/50 border border-gray-200 hover:bg-white hover:shadow-md transition-all group"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-blue-500 transition-all">
                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                    <h4 className="font-medium text-gray-800">{label}</h4>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
        </button>
    );
}
