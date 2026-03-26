'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    UserPlus,
    Users,
    Trophy,
    TrendingUp,
    MessageCircle,
    MoreVertical,
    Check,
    X,
    Filter,
    Award,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Friend {
    id: number;
    name: string;
    username: string;
    avatar: string;
    level: number;
    xp: number;
    savings: number;
    goalsCompleted: number;
    status: 'active' | 'pending' | 'suggested';
    mutualFriends?: number;
}

export default function FriendsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'find'>('friends');

    const mockFriends: Friend[] = [
        {
            id: 1,
            name: 'Rahul Sharma',
            username: '@rahul_saves',
            avatar: 'R',
            level: 15,
            xp: 5420,
            savings: 85000,
            goalsCompleted: 12,
            status: 'active',
        },
        {
            id: 2,
            name: 'Priya Patel',
            username: '@priya_budgets',
            avatar: 'P',
            level: 18,
            xp: 6890,
            savings: 120000,
            goalsCompleted: 15,
            status: 'active',
        },
        {
            id: 3,
            name: 'Amit Kumar',
            username: '@amit_investor',
            avatar: 'A',
            level: 12,
            xp: 4200,
            savings: 65000,
            goalsCompleted: 9,
            status: 'active',
        },
    ];

    const pendingRequests: Friend[] = [
        {
            id: 4,
            name: 'Sneha Reddy',
            username: '@sneha_goals',
            avatar: 'S',
            level: 10,
            xp: 3200,
            savings: 45000,
            goalsCompleted: 6,
            status: 'pending',
            mutualFriends: 3,
        },
        {
            id: 5,
            name: 'Rohan Desai',
            username: '@rohan_finance',
            avatar: 'R',
            level: 14,
            xp: 4980,
            savings: 78000,
            goalsCompleted: 11,
            status: 'pending',
            mutualFriends: 5,
        },
    ];

    const suggestedFriends: Friend[] = [
        {
            id: 6,
            name: 'Neha Singh',
            username: '@neha_wealthy',
            avatar: 'N',
            level: 20,
            xp: 8500,
            savings: 150000,
            goalsCompleted: 18,
            status: 'suggested',
            mutualFriends: 7,
        },
        {
            id: 7,
            name: 'Vikram Joshi',
            username: '@vikram_saver',
            avatar: 'V',
            level: 16,
            xp: 6100,
            savings: 95000,
            goalsCompleted: 13,
            status: 'suggested',
            mutualFriends: 4,
        },
    ];

    const handleAcceptRequest = (friendId: number, name: string) => {
        toast.success(`You are now friends with ${name}! 🎉`);
    };

    const handleRejectRequest = (name: string) => {
        toast(`Request from ${name} declined`);
    };

    const handleAddFriend = (name: string) => {
        toast.success(`Friend request sent to ${name}!`);
    };

    const filteredFriends = mockFriends.filter(
        (friend) =>
            friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        Friends
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Connect with friends and compete on leaderboards
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="backdrop-blur-xl bg-white/70 rounded-xl shadow-lg border border-white/50 px-4 py-2 flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-600" />
                        <span className="font-semibold text-gray-800">{mockFriends.length} Friends</span>
                    </div>
                </div>
            </motion.div>

            {/* Search & Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/50 p-6"
            >
                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search friends by name or username..."
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/50"
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {[
                        { id: 'friends' as const, label: 'My Friends', count: mockFriends.length },
                        { id: 'pending' as const, label: 'Requests', count: pendingRequests.length },
                        { id: 'find' as const, label: 'Find Friends', count: suggestedFriends.length },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                                    : 'bg-white/50 text-gray-700 hover:bg-white'
                                }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span
                                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                                        }`}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {/* My Friends Tab */}
                    {activeTab === 'friends' && (
                        <motion.div
                            key="friends"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-3"
                        >
                            {filteredFriends.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No friends found</p>
                                </div>
                            ) : (
                                filteredFriends.map((friend) => (
                                    <FriendCard key={friend.id} friend={friend} type="friend" />
                                ))
                            )}
                        </motion.div>
                    )}

                    {/* Pending Requests Tab */}
                    {activeTab === 'pending' && (
                        <motion.div
                            key="pending"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-3"
                        >
                            {pendingRequests.length === 0 ? (
                                <div className="text-center py-12">
                                    <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No pending requests</p>
                                </div>
                            ) : (
                                pendingRequests.map((friend) => (
                                    <FriendCard
                                        key={friend.id}
                                        friend={friend}
                                        type="pending"
                                        onAccept={() => handleAcceptRequest(friend.id, friend.name)}
                                        onReject={() => handleRejectRequest(friend.name)}
                                    />
                                ))
                            )}
                        </motion.div>
                    )}

                    {/* Find Friends Tab */}
                    {activeTab === 'find' && (
                        <motion.div
                            key="find"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-3"
                        >
                            {suggestedFriends.map((friend) => (
                                <FriendCard
                                    key={friend.id}
                                    friend={friend}
                                    type="suggested"
                                    onAdd={() => handleAddFriend(friend.name)}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

// Friend Card Component
function FriendCard({
    friend,
    type,
    onAccept,
    onReject,
    onAdd,
}: {
    friend: Friend;
    type: 'friend' | 'pending' | 'suggested';
    onAccept?: () => void;
    onReject?: () => void;
    onAdd?: () => void;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            className="p-4 rounded-xl bg-white/50 border border-gray-200 hover:bg-white hover:shadow-md transition-all"
        >
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {friend.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white">
                        {friend.level}
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">{friend.name}</h3>
                    <p className="text-sm text-gray-500">{friend.username}</p>
                    {friend.mutualFriends && (
                        <p className="text-xs text-gray-400 mt-1">
                            {friend.mutualFriends} mutual friends
                        </p>
                    )}
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6 px-4">
                    <div className="text-center">
                        <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                            <Trophy className="w-4 h-4 text-orange-500" />
                            {friend.xp}
                        </div>
                        <p className="text-xs text-gray-500">XP</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                            <Award className="w-4 h-4 text-emerald-500" />
                            {friend.goalsCompleted}
                        </div>
                        <p className="text-xs text-gray-500">Goals</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {type === 'friend' && (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </motion.button>
                            <Link href={`/profile/${friend.id}`}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium text-sm hover:shadow-lg transition-all"
                                >
                                    View Profile
                                </motion.button>
                            </Link>
                        </>
                    )}

                    {type === 'pending' && (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onAccept}
                                className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                            >
                                <Check className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onReject}
                                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </>
                    )}

                    {type === 'suggested' && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onAdd}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium text-sm hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add Friend
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
