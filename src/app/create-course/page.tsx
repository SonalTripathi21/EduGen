"use client"
import React, { useState } from 'react'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'
import { Loader2, Lightbulb, Clock, BookOpen, Layers } from 'lucide-react'

export default function CreateCourse() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        topic: '',
        level: 'Beginner',
        duration: '2 Hours',
        noOfChapters: 5
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/course/create', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.courseId) {
                router.push(`/course/${data.course.courseId}`);
            } else {
                alert("Error creating course");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="flex flex-col items-center justify-center p-10">
                <h1 className="text-4xl font-bold text-primary mb-10 text-center">Create New Course</h1>

                <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl border">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* Topic */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-lg flex items-center gap-2">
                                <Lightbulb className="text-yellow-500" /> Topic / Course Title
                            </label>
                            <input
                                type="text"
                                name="topic"
                                placeholder="e.g. Python for Data Science"
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                required
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Level */}
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-lg flex items-center gap-2">
                                    <Layers className="text-blue-500" /> Level
                                </label>
                                <select
                                    name="level"
                                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    onChange={handleInputChange}
                                    value={formData.level}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>

                            {/* Duration */}
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-lg flex items-center gap-2">
                                    <Clock className="text-purple-500" /> Duration
                                </label>
                                <select
                                    name="duration"
                                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    onChange={handleInputChange}
                                    value={formData.duration}
                                >
                                    <option value="1 Hour">1 Hour</option>
                                    <option value="2 Hours">2 Hours</option>
                                    <option value="5 Hours">5 Hours</option>
                                    <option value="10 Hours">10 Hours</option>
                                    <option value="more than 10 Hours">more than 10 Hours</option>
                                </select>
                            </div>
                        </div>

                        {/* No of Chapters */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-lg flex items-center gap-2">
                                <BookOpen className="text-pink-500" /> Number of Chapters
                            </label>
                            <input
                                type="number"
                                name="noOfChapters"
                                min={1}
                                max={10}
                                value={formData.noOfChapters}
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                onChange={handleInputChange}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white p-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                        >
                            {loading ? <><Loader2 className="animate-spin" /> Generating Course...</> : "Generate Course Layout"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
