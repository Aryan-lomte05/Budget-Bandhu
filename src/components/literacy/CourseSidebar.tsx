"use client";

import { Course, Lesson } from '@/lib/constants/courses';
import { CheckCircle2, Lock, Play, FileText, Calculator, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseSidebarProps {
    course: Course;
    currentLessonId: string;
    onLessonSelect: (lessonId: string) => void;
}

export function CourseSidebar({ course, currentLessonId, onLessonSelect }: CourseSidebarProps) {
    const getLessonIcon = (type: string) => {
        switch (type) {
            case 'video': return Play;
            case 'article': return FileText;
            case 'calculator': return Calculator;
            case 'quiz': return Award;
            default: return FileText;
        }
    };

    const completedCount = course.lessons.filter(l => l.completed).length;

    return (
        <div className="glass p-6 rounded-2xl border-2 border-white/50 sticky top-6">
            {/* Course Info */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${course.color}20` }}
                    >
                        {course.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{course.title}</h3>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>Progress</span>
                    <span className="font-semibold">
                        {completedCount}/{course.lessons.length}
                    </span>
                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-mint-500 to-skyBlue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedCount / course.lessons.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Lessons List */}
            <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    Lessons
                </h4>

                {course.lessons.map((lesson, index) => {
                    const Icon = getLessonIcon(lesson.type);
                    const isActive = lesson.id === currentLessonId;
                    const isLocked = index > 0 && !course.lessons[index - 1].completed;

                    return (
                        <button
                            key={lesson.id}
                            onClick={() => !isLocked && onLessonSelect(lesson.id)}
                            disabled={isLocked}
                            className={`w-full p-3 rounded-xl text-left transition-all ${isActive
                                    ? 'bg-gradient-to-r from-mint-500 to-skyBlue-500 text-white shadow-lg'
                                    : isLocked
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white hover:bg-mint-50 border border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                    {isLocked ? (
                                        <Lock className="w-4 h-4" />
                                    ) : lesson.completed ? (
                                        <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-white' : 'text-mint-600'}`} />
                                    ) : (
                                        <Icon className="w-4 h-4" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm mb-1 line-clamp-2">
                                        {lesson.title}
                                    </div>
                                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                                        {lesson.duration} min • {lesson.type}
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Certificate */}
            {completedCount === course.lessons.length && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-gradient-to-r from-mint-500 to-skyBlue-500 rounded-xl text-center"
                >
                    <Award className="w-8 h-8 text-white mx-auto mb-2" />
                    <p className="text-white font-semibold text-sm">Course Completed! 🎉</p>
                    <button className="mt-3 px-4 py-2 bg-white text-mint-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Download Certificate
                    </button>
                </motion.div>
            )}
        </div>
    );
}
