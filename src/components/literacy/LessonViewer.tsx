"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lesson } from '@/lib/constants/courses';
import { Play, FileText, Calculator, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

interface LessonViewerProps {
    lesson: Lesson;
    onComplete: () => void;
    onNext: () => void;
    hasNext: boolean;
}

export function LessonViewer({ lesson, onComplete, onNext, hasNext }: LessonViewerProps) {
    const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);

    const getLessonIcon = (type: string) => {
        switch (type) {
            case 'video': return Play;
            case 'article': return FileText;
            case 'calculator': return Calculator;
            case 'quiz': return CheckCircle2;
            default: return FileText;
        }
    };

    const Icon = getLessonIcon(lesson.type);

    const handleQuizSubmit = () => {
        setShowResults(true);
        const correctCount = quizAnswers.filter(
            (answer, index) => answer === lesson.quiz?.questions[index].correctAnswer
        ).length;

        if (correctCount === lesson.quiz?.questions.length) {
            setTimeout(() => {
                onComplete();
            }, 2000);
        }
    };

    const resetQuiz = () => {
        setQuizAnswers([]);
        setShowResults(false);
    };

    return (
        <div className="space-y-6">
            {/* Lesson Header */}
            <div className="glass p-6 rounded-2xl border-2 border-white/50">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-mint-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-mint-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-mint-500" />
                                {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                            </span>
                            <span>•</span>
                            <span>{lesson.duration} min</span>
                            {lesson.completed && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-mint-600 font-medium">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Completed
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lesson Content */}
            <AnimatePresence mode="wait">
                {/* VIDEO LESSON */}
                {lesson.type === 'video' && (
                    <motion.div
                        key="video"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass p-6 rounded-2xl border-2 border-white/50"
                    >
                        <div className="aspect-video bg-gradient-to-br from-mint-500 to-skyBlue-500 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="relative z-10 text-center">
                                <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <Play className="w-10 h-10 text-white" />
                                </div>
                                <p className="text-white font-medium">Video Player (Demo)</p>
                                <p className="text-white/80 text-sm mt-2">In production, this would embed YouTube/Vimeo</p>
                            </div>
                        </div>

                        {lesson.content && (
                            <div className="prose prose-sm max-w-none">
                                <ReactMarkdown>{lesson.content}</ReactMarkdown>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ARTICLE LESSON */}
                {lesson.type === 'article' && (
                    <motion.div
                        key="article"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass p-8 rounded-2xl border-2 border-white/50"
                    >
                        <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>
                                {lesson.content || `# ${lesson.title}

This is where the article content would be displayed. In a real implementation, this would contain comprehensive educational content about the topic.

## Key Points

- Understanding the fundamentals
- Practical applications
- Real-world examples
- Best practices

## Summary

After completing this lesson, you'll have a solid understanding of the concepts covered and be ready to apply them in your financial journey.`}
                            </ReactMarkdown>
                        </div>
                    </motion.div>
                )}

                {/* QUIZ LESSON */}
                {lesson.type === 'quiz' && lesson.quiz && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {lesson.quiz.questions.map((question, qIndex) => (
                            <div key={qIndex} className="glass p-6 rounded-2xl border-2 border-white/50">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Question {qIndex + 1}: {question.question}
                                </h3>

                                <div className="space-y-3">
                                    {question.options.map((option, oIndex) => {
                                        const isSelected = quizAnswers[qIndex] === oIndex;
                                        const isCorrect = oIndex === question.correctAnswer;
                                        const showAnswer = showResults;

                                        return (
                                            <button
                                                key={oIndex}
                                                onClick={() => {
                                                    if (!showResults) {
                                                        const newAnswers = [...quizAnswers];
                                                        newAnswers[qIndex] = oIndex;
                                                        setQuizAnswers(newAnswers);
                                                    }
                                                }}
                                                disabled={showResults}
                                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${showAnswer && isCorrect
                                                        ? 'bg-mint-50 border-mint-500 text-mint-900'
                                                        : showAnswer && isSelected && !isCorrect
                                                            ? 'bg-coral-50 border-coral-500 text-coral-900'
                                                            : isSelected
                                                                ? 'bg-skyBlue-50 border-skyBlue-500'
                                                                : 'bg-white border-gray-200 hover:border-mint-500'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${showAnswer && isCorrect
                                                            ? 'border-mint-500 bg-mint-500'
                                                            : showAnswer && isSelected && !isCorrect
                                                                ? 'border-coral-500 bg-coral-500'
                                                                : isSelected
                                                                    ? 'border-skyBlue-500 bg-skyBlue-500'
                                                                    : 'border-gray-300'
                                                        }`}>
                                                        {(showAnswer && isCorrect) || (isSelected && !showAnswer) ? (
                                                            <div className="w-3 h-3 rounded-full bg-white" />
                                                        ) : null}
                                                    </div>
                                                    <span className="font-medium">{option}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {showResults && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 p-4 bg-skyBlue-50 rounded-xl border border-skyBlue-200"
                                    >
                                        <p className="text-sm text-skyBlue-900">
                                            <strong>Explanation:</strong> {question.explanation}
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        ))}

                        {!showResults ? (
                            <Button
                                onClick={handleQuizSubmit}
                                disabled={quizAnswers.length !== lesson.quiz.questions.length}
                                className="w-full bg-gradient-to-r from-mint-500 to-skyBlue-500 hover:from-mint-600 hover:to-skyBlue-600"
                            >
                                Submit Quiz
                            </Button>
                        ) : (
                            <div className="space-y-4">
                                <div className="glass p-6 rounded-2xl border-2 border-white/50 text-center">
                                    <div className="text-5xl mb-3">
                                        {quizAnswers.filter((a, i) => a === lesson.quiz!.questions[i].correctAnswer).length === lesson.quiz.questions.length
                                            ? '🎉'
                                            : '📚'}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {quizAnswers.filter((a, i) => a === lesson.quiz!.questions[i].correctAnswer).length}/{lesson.quiz.questions.length} Correct
                                    </h3>
                                    <p className="text-gray-600">
                                        {quizAnswers.filter((a, i) => a === lesson.quiz!.questions[i].correctAnswer).length === lesson.quiz.questions.length
                                            ? 'Perfect score! You really know your stuff! 🌟'
                                            : 'Keep learning! Review the explanations above.'}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Button onClick={resetQuiz} variant="outline" className="flex-1">
                                        Try Again
                                    </Button>
                                    {quizAnswers.filter((a, i) => a === lesson.quiz!.questions[i].correctAnswer).length === lesson.quiz.questions.length && (
                                        <Button
                                            onClick={onComplete}
                                            className="flex-1 bg-gradient-to-r from-mint-500 to-skyBlue-500"
                                        >
                                            Mark Complete
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* CALCULATOR LESSON */}
                {lesson.type === 'calculator' && (
                    <motion.div
                        key="calculator"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass p-6 rounded-2xl border-2 border-white/50 text-center"
                    >
                        <div className="text-6xl mb-4">🧮</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Calculator</h3>
                        <p className="text-gray-600 mb-6">
                            This lesson includes an interactive calculator tool
                        </p>
                        <Button
                            onClick={() => window.open('/literacy/calculators/compound', '_blank')}
                            className="bg-gradient-to-r from-mint-500 to-skyBlue-500"
                        >
                            Open Calculator
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Buttons */}
            {(lesson.type === 'video' || lesson.type === 'article') && (
                <div className="flex gap-3">
                    {!lesson.completed && (
                        <Button
                            onClick={onComplete}
                            className="flex-1 bg-gradient-to-r from-mint-500 to-skyBlue-500"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mark as Complete
                        </Button>
                    )}
                    {hasNext && (
                        <Button onClick={onNext} variant="outline" className="flex-1">
                            Next Lesson
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
