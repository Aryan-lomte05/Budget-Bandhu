"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCourseById } from '@/lib/constants/courses';
import { CourseSidebar } from '@/components/literacy/CourseSidebar';
import { LessonViewer } from '@/components/literacy/LessonViewer';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.courseId as string;
    const course = getCourseById(courseId);

    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

    if (!course) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
                <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
                <Button onClick={() => router.push('/literacy')}>Back to Courses</Button>
            </div>
        );
    }

    const currentLesson = course.lessons[currentLessonIndex];

    const handleLessonComplete = () => {
        // In a real app, this would update the database
        console.log('Lesson completed:', currentLesson.id);
        currentLesson.completed = true;
    };

    const handleNextLesson = () => {
        if (currentLessonIndex < course.lessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
        }
    };

    const handleLessonSelect = (lessonId: string) => {
        const index = course.lessons.findIndex(l => l.id === lessonId);
        if (index !== -1) {
            setCurrentLessonIndex(index);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <Button
                onClick={() => router.push('/literacy')}
                variant="ghost"
                className="mb-6"
            >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Courses
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <LessonViewer
                        lesson={currentLesson}
                        onComplete={handleLessonComplete}
                        onNext={handleNextLesson}
                        hasNext={currentLessonIndex < course.lessons.length - 1}
                    />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <CourseSidebar
                        course={course}
                        currentLessonId={currentLesson.id}
                        onLessonSelect={handleLessonSelect}
                    />
                </div>
            </div>
        </div>
    );
}
