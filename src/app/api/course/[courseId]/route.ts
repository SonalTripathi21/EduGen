import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses, chapters } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const { courseId } = await params;

        // Fetch course
        const course = await db.select().from(courses).where(eq(courses.courseId, courseId));

        if (!course || course.length === 0) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        // Fetch chapters
        const courseChapters = await db.select().from(chapters)
            .where(eq(chapters.courseId, course[0].id))
            .orderBy(chapters.chapterId);

        return NextResponse.json({
            course: course[0],
            chapters: courseChapters
        });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
