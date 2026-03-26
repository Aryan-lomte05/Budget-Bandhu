"use client";

import { motion } from 'framer-motion';
import { courses } from '@/lib/constants/courses';
import { Award, BookOpen, Clock, TrendingUp } from 'lucide-react';

export function ProgressTracker() {
    const enrolledCourses = courses.filter(c => c.enrolled);
    const completedCourses = enrolledCourses.filter(c => c.progress === 100);
    const totalLessons = enrolledCourses.reduce((sum, c) => sum + c.lessons.length, 0);
    const completedLessons = enrolledCourses.reduce(
        (sum, c) => sum + c.lessons.filter(l => l.completed).length,
        0
    );
    const totalMinutes = enrolledCourses.reduce(
        (sum, c) => sum + c.lessons.filter(l => l.completed).reduce((s, l) => s + l.duration, 0),
        0
    );

    const stats = [
        {
            label: 'Courses Completed',
            value: completedCourses.length,
            total: enrolledCourses.length,
            icon: Award,
            color: '#F59E0B',
        },
        {
            label: 'Lessons Done',
            value: completedLessons,
            total: totalLessons,
            icon: BookOpen,
            color: '#10B981',
        },
        {
            label: 'Learning Time',
            value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
            icon: Clock,
            color: '#3B82F6',
        },
        {
            label: 'Streak',
            value: '7 days',
            icon: TrendingUp,
            color: '#EC4899',
        },
    ];

    return (
        <div className="glass p-6 rounded-2xl border-2 border-white/50">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
                <span className="px-3 py-1 bg-mint-100 text-mint-700 rounded-full text-sm font-semibold">
                    Level {Math.floor(completedLessons / 5) + 1}
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                            style={{ backgroundColor: `${stat.color}20` }}
                        >
                            <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {stat.value}
                            {stat.total && (
                                <span className="text-sm text-gray-500 font-normal">
                                    /{stat.total}
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
