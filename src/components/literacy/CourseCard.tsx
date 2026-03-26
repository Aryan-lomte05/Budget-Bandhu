"use client";

import { motion } from 'framer-motion';
import { Course } from '@/lib/constants/courses';
import { Clock, BookOpen, Award, Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface CourseCardProps {
    course: Course;
    index: number;
}

export function CourseCard({ course, index }: CourseCardProps) {
    const router = useRouter();

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'bg-mint-100 text-mint-700 border-mint-200';
            case 'intermediate': return 'bg-skyBlue-100 text-skyBlue-700 border-skyBlue-200';
            case 'advanced': return 'bg-coral-100 text-coral-700 border-coral-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const completedLessons = course.lessons.filter(l => l.completed).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass p-6 rounded-2xl border-2 border-white/50 hover:border-mint-500/30 transition-all cursor-pointer relative overflow-hidden group"
            onClick={() => course.enrolled && router.push(`/literacy/${course.id}`)}
        >
            {/* Background gradient */}
            <div
                className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                style={{ background: `radial-gradient(circle at top right, ${course.color} 0%, transparent 70%)` }}
            />

            {/* Lock overlay for unenrolled courses */}
            {!course.enrolled && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                    <div className="text-center">
                        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-gray-600">Enroll to unlock</p>
                    </div>
                </div>
            )}

            <div className="relative z-0">
                {/* Icon & Difficulty Badge */}
                <div className="flex items-start justify-between mb-4">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                        style={{ backgroundColor: `${course.color}20` }}
                    >
                        {course.icon}
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                    </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-mint-600 transition-colors">
                    {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lessons.length} lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration} min</span>
                    </div>
                </div>

                {/* Progress (for enrolled courses) */}
                {course.enrolled && (
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">Progress</span>
                            <span className="font-semibold text-gray-900">
                                {completedLessons}/{course.lessons.length} completed
                            </span>
                        </div>
                        <Progress value={course.progress} max={100} />
                    </div>
                )}

                {/* CTA Button */}
                <Button
                    className={`w-full ${course.enrolled
                            ? 'bg-gradient-to-r from-mint-500 to-skyBlue-500 hover:from-mint-600 hover:to-skyBlue-600'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (course.enrolled) {
                            router.push(`/literacy/${course.id}`);
                        } else {
                            // Enroll action
                            console.log('Enroll in course:', course.id);
                        }
                    }}
                >
                    {course.enrolled ? (
                        course.progress === 100 ? (
                            <>
                                <Award className="w-4 h-4 mr-2" />
                                View Certificate
                            </>
                        ) : (
                            'Continue Learning'
                        )
                    ) : (
                        'Enroll Now'
                    )}
                </Button>
            </div>
        </motion.div>
    );
}
