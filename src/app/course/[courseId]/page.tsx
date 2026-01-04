import Header from "@/components/Header";
import { db } from "@/db";
import { chapters, courses } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import Link from "next/link";
import { PlayCircle, CheckCircle } from 'lucide-react';
import { redirect } from "next/navigation";

export default async function CourseOverview({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const course = await db.select().from(courses).where(eq(courses.courseId, courseId));

    if (!course || course.length === 0) {
        return redirect("/dashboard");
    }

    const courseChapters = await db.select().from(chapters)
        .where(eq(chapters.courseId, course[0].id))
        .orderBy(asc(chapters.chapterId));

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            {/* Course Banner / Header */}
            <div className="bg-primary text-white p-10">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">{course[0].name}</h1>
                    <p className="text-primary-foreground/80 mb-6">{course[0].category} • {course[0].level} • {course[0].duration}</p>
                    <Link href={`/course/${courseId}/chapter/0`}>
                        <button className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition shadow-lg flex items-center gap-2">
                            <PlayCircle /> Start Course
                        </button>
                    </Link>
                </div>
            </div>

            {/* Chapters List */}
            <div className="max-w-7xl mx-auto p-10">
                <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                <div className="flex flex-col gap-4">
                    {courseChapters.map((chapter, index) => (
                        <Link href={`/course/${courseId}/chapter/${index}`} key={chapter.id}>
                            <div className="bg-white p-5 rounded-lg border hover:shadow-md transition flex justify-between items-center cursor-pointer group">
                                <div className="flex gap-4 items-center">
                                    <span className="bg-slate-100 text-slate-600 w-10 h-10 rounded-full flex items-center justify-center font-bold group-hover:bg-primary group-hover:text-white transition">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <h3 className="font-semibold text-lg">{chapter.name}</h3>
                                        {chapter.content ? (
                                            <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Ready</p>
                                        ) : (
                                            <p className="text-xs text-slate-400">Not generated yet</p>
                                        )}
                                    </div>
                                </div>
                                <PlayCircle className="text-slate-300 group-hover:text-primary transition" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
