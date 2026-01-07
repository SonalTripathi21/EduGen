import Header from "@/components/Header";
import { db } from "@/db";
import { chapters, courses } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChapterView from "@/components/ChapterView";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ChapterPage({ params }: { params: Promise<{ courseId: string, chapterIndex: string }> }) {
    const { courseId, chapterIndex } = await params;
    const index = parseInt(chapterIndex);

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    const course = await db.select()
        .from(courses)
        .where(
            and(
                eq(courses.courseId, courseId),
                eq(courses.userEmail, userEmail || "")
            )
        );

    if (!course || course.length === 0) {
        return redirect("/dashboard");
    }

    // Get all chapters to determine current, prev, next
    const allChapters = await db.select().from(chapters)
        .where(eq(chapters.courseId, course[0].id))
        .orderBy(asc(chapters.chapterId));

    const chapter = allChapters.find(c => c.chapterId === index);

    if (!chapter) {
        // If index out of bounds, maybe go back to overview
        redirect(`/course/${courseId}`);
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="p-6 md:p-10 max-w-7xl mx-auto">
                <Link href={`/course/${courseId}`} className="flex items-center gap-2 text-slate-500 mb-6 hover:text-black transition">
                    <ArrowLeft /> Back to Course
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
                    {/* Sidebar (Desktop only or collateral) */}
                    <div className="hidden md:block">
                        <div className="bg-white rounded-xl border p-5 sticky top-24">
                            <h3 className="font-bold text-lg mb-4">Chapters</h3>
                            <div className="flex flex-col gap-2">
                                {allChapters.map((c, i) => (
                                    <Link href={`/course/${courseId}/chapter/${i}`} key={c.id}>
                                        <div className={`p-3 rounded-lg text-sm cursor-pointer transition ${i === index ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary' : 'hover:bg-slate-50'}`}>
                                            {i + 1}. {c.name}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div>
                        <ChapterView
                            chapter={chapter as any}
                            course={course[0] as any}
                            chapterIndex={index}
                            totalChapters={allChapters.length}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
